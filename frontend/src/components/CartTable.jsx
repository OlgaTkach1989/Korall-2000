import { useCart } from "../context/CartContext";
import { useI18n } from "../context/I18nContext";

const fallbackImage =
  "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=600&q=60";

const CartTable = ({ onCheckout }) => {
  const { items, updateQuantity, removeItem, summary } = useCart();
  const { t } = useI18n();
  const remaining =
    summary.freeShippingThreshold != null
      ? Math.max(0, summary.freeShippingThreshold - summary.subtotal)
      : 0;

  return (
    <section className="cart">
      <div className="cart-table">
        <h2>{t("cart.title")}</h2>
        <table>
          <thead>
            <tr>
              <th>{t("cart.product")}</th>
              <th>{t("cart.amount")}</th>
              <th>{t("cart.price")}</th>
              <th>{t("cart.remove")}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4}>{t("cart.empty")}</td>
              </tr>
            ) : (
              items.map((entry) => {
                const image =
                  entry.product.image_url || entry.product.imageUrl || fallbackImage;

                return (
                  <tr key={entry.product.id}>
                    <td className="cart-product">
                      <img src={image} alt={entry.product.name} loading="lazy" />
                      <span>{entry.product.name}</span>
                    </td>
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
                        x
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <aside className="cart-summary">
        <p>
          {t("cart.subtotal")}: {summary.subtotal.toFixed(2)} €
        </p>
        <p>
          {t("cart.shipping")}: {summary.shipping.toFixed(2)} €
          {summary.shipping === 0 && ` (${t("cart.freeShippingNote")})`}
        </p>
        {remaining > 0 && (
          <p className="muted">
            {t("cart.freeShippingRemaining", {
              amount: remaining.toFixed(2),
            })}
          </p>
        )}
        <p className="total">
          {t("cart.total")}: {summary.total.toFixed(2)} €
        </p>
        <button className="primary" disabled={!items.length} onClick={onCheckout}>
          {t("cart.checkout")}
        </button>
      </aside>
    </section>
  );
};

export default CartTable;
