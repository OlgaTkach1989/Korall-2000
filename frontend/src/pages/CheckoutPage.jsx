import CheckoutForm from "../components/CheckoutForm";
import { useCart } from "../context/CartContext";
import { useI18n } from "../context/I18nContext";

const CheckoutPage = () => {
  const { summary } = useCart();
  const { t } = useI18n();
  const remaining =
    summary.freeShippingThreshold != null
      ? Math.max(0, summary.freeShippingThreshold - summary.subtotal)
      : 0;

  return (
    <div className="checkout-page">
      <CheckoutForm />
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
      </aside>
    </div>
  );
};

export default CheckoutPage;
