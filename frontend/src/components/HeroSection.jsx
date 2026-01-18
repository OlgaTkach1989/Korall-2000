import heroImage from "../assets/HomeSeite.jpg";
import { useI18n } from "../context/I18nContext";

const HeroSection = ({ onCTAClick }) => {
  const { t } = useI18n();
  return (
    <section className="hero" style={{ "--hero-image": `url(${heroImage})` }}>
      <div>
        <p className="hero-eyebrow">{t("hero.eyebrow")}</p>
        <h1>{t("hero.title")}</h1>
        <button className="primary" onClick={onCTAClick}>
          {t("hero.cta")}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
