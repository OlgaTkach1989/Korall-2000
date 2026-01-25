import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

const SuccessPage = () => {
  const { t } = useI18n();
  const number = Math.floor(Math.random() * 9000 + 1000);

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
