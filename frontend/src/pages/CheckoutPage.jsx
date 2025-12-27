import CheckoutForm from "../components/CheckoutForm";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { summary } = useCart();
  const remaining =
    summary.freeShippingThreshold != null
      ? Math.max(0, summary.freeShippingThreshold - summary.subtotal)
      : 0;

  return (
    <div className="checkout-page">
      <CheckoutForm />
      <aside className="cart-summary">
        <p>Zwischensumme: {summary.subtotal.toFixed(2)} €</p>
        <p>
          Versand: {summary.shipping.toFixed(2)} €
          {summary.shipping === 0 && " (kostenlos ab 100 €)"}
        </p>
        {remaining > 0 && (
          <p className="muted">
            Noch {remaining.toFixed(2)} € bis kostenloser Versand
          </p>
        )}
        <p className="total">Gesamt: {summary.total.toFixed(2)} €</p>
      </aside>
    </div>
  );
};

export default CheckoutPage;
