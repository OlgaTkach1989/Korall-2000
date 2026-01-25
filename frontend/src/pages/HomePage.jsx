import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHomepageFeatures } from "../api/shop";
import FeatureGrid from "../components/FeatureGrid";
import HeroSection from "../components/HeroSection";
import { useI18n } from "../context/I18nContext";

const HomePage = () => {
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();
  const { t, language } = useI18n();

  useEffect(() => {
    fetchHomepageFeatures()
      .then((response) => {
        if (language === "en") {
          setFeatures([
            {
              title: t("features.fast.title"),
              description: t("features.fast.description"),
            },
            {
              title: t("features.sizes.title"),
              description: t("features.sizes.description"),
            },
            {
              title: t("features.prices.title"),
              description: t("features.prices.description"),
            },
          ]);
          return;
        }
        setFeatures(response.features);
      })
      .catch(() =>
        setFeatures([
          {
            title: t("features.fast.title"),
            description: t("features.fast.description"),
          },
          {
            title: t("features.sizes.title"),
            description: t("features.sizes.description"),
          },
          {
            title: t("features.prices.title"),
            description: t("features.prices.description"),
          },
        ]),
      );
  }, [language, t]);

  return (
    <>
      <HeroSection onCTAClick={() => navigate("/products")} />
      <FeatureGrid features={features} />
    </>
  );
};

export default HomePage;
