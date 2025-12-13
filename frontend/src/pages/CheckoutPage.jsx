import CheckoutForm from "../components/CheckoutForm";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { summary } = useCart();
  return (
    <div className="checkout-page">
      <CheckoutForm />
      <aside className="cart-summary">
        <p>Zwischensumme: {summary.subtotal.toFixed(2)} €</p>
        <p>Versand: {summary.shipping.toFixed(2)} €</p>
        <p className="total">Gesamt: {summary.total.toFixed(2)} €</p>
      </aside>
    </div>
  );
};

export default CheckoutPage;
