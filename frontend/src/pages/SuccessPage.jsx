import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

const SuccessPage = () => {
  const { t } = useI18n();
  const location = useLocation();
  const stateOrderId = location.state?.orderId;
  const savedOrderId = localStorage.getItem("lastOrderId");
  const number = stateOrderId ?? savedOrderId ?? "-";

  return (
    <section className="success-page">
      <div className="success-card">
        <p className="icon">✓</p>
        <h2>{t("success.title")}</h2>
        <p>{t("success.orderNumber", { number })}</p>
        <Link to="/" className="primary">
          {t("success.backHome")}
        </Link>
      </div>
    </section>
  );
};

export default SuccessPage;
