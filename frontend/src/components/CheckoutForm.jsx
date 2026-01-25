import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/shop";
import { useCart } from "../context/CartContext";
import { useI18n } from "../context/I18nContext";

const initialForm = {
  first_name: "",
  last_name: "",
  street: "",
  house_number: "",
  postal_code: "",
  city: "",
  contact_email: "",
  delivery_type: "delivery",
  notes: "",
};

const CheckoutForm = () => {
  const { t } = useI18n();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { items, clear } = useCart();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      ...form,
      items: items.map((entry) => ({
        product_id: entry.product.id,
        quantity: entry.quantity,
        unit_price: entry.product.price,
      })),
    };

    try {
      await createOrder(payload);
      clear();
      navigate("/order-success");
    } catch (err) {
      setError(t("checkout.error"));
    } finally {
      setLoading(false);
    }
  };

  const isDelivery = form.delivery_type === "delivery";

  return (
    <section className="checkout">
      <h2>{t("checkout.address")}</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            {t("checkout.firstName")}
            <input name="first_name" value={form.first_name} onChange={handleChange} required />
          </label>
          <label>
            {t("checkout.lastName")}
            <input name="last_name" value={form.last_name} onChange={handleChange} required />
          </label>
          <label>
            {t("checkout.email")}
            <input
              type="email"
              name="contact_email"
              value={form.contact_email}
              onChange={handleChange}
              required
            />
          </label>
          {isDelivery && (
            <>
              <label>
                {t("checkout.street")}
                <input name="street" value={form.street} onChange={handleChange} required />
              </label>
              <label>
                {t("checkout.houseNumber")}
                <input
                  name="house_number"
                  value={form.house_number}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                {t("checkout.postalCode")}
                <input
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                {t("checkout.city")}
                <input name="city" value={form.city} onChange={handleChange} required />
              </label>
            </>
          )}
        </div>
        <fieldset className="radio-group">
          <legend>{t("checkout.shippingOptions")}</legend>
          <label>
            <input
              type="radio"
              value="delivery"
              name="delivery_type"
              checked={form.delivery_type === "delivery"}
              onChange={handleChange}
            />
            {t("checkout.delivery")}
          </label>
          <label>
            <input
              type="radio"
              value="pickup"
              name="delivery_type"
              checked={form.delivery_type === "pickup"}
              onChange={handleChange}
            />
            {t("checkout.pickup")}
          </label>
        </fieldset>
        {error ? <p className="error">{error}</p> : null}
        <button className="primary" type="submit" disabled={loading || !items.length}>
          {loading ? t("checkout.submitting") : t("checkout.submit")}
        </button>
      </form>
    </section>
  );
};

export default CheckoutForm;
