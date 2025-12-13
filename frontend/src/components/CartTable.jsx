import { useCart } from "../context/CartContext";

const CartTable = ({ onCheckout }) => {
  const { items, updateQuantity, removeItem, summary } = useCart();

  return (
    <section className="cart">
      <div className="cart-table">
        <h2>Ihr Warenkorb</h2>
        <table>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Menge</th>
              <th>Preis</th>
              <th>Entfernen</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4}>Ihr Warenkorb ist leer.</td>
              </tr>
            ) : (
              items.map((entry) => (
                <tr key={entry.product.id}>
                  <td>{entry.product.name}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={entry.quantity}
                      onChange={(event) =>
                        updateQuantity(entry.product.id, Number(event.target.value))
                      }
                    />
                  </td>
                  <td>{(entry.product.price * entry.quantity).toFixed(2)} €</td>
                  <td>
                    <button className="ghost" onClick={() => removeItem(entry.product.id)}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <aside className="cart-summary">
        <p>Zwischensumme: {summary.subtotal.toFixed(2)} €</p>
        <p>Versand: {summary.shipping.toFixed(2)} €</p>
        <p className="total">Gesamt: {summary.total.toFixed(2)} €</p>
        <button className="primary" disabled={!items.length} onClick={onCheckout}>
          Zur Kasse
        </button>
      </aside>
    </section>
  );
};

export default CartTable;
