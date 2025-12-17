import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHomepageFeatures } from "../api/shop";
import FeatureGrid from "../components/FeatureGrid";
import HeroSection from "../components/HeroSection";

const HomePage = () => {
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomepageFeatures()
      .then((response) => setFeatures(response.features))
      .catch(() =>
        setFeatures([
          { title: "Schnelle Produktion", description: "Lieferung innerhalb weniger Tage." },
          { title: "Individuelle Größen", description: "Produktion passend zu Ihrem Bedarf." },
          { title: "Faire Preise", description: "Direkt vom Hersteller." },
        ]),
      );
  }, []);

  return (
    <>
      <HeroSection onCTAClick={() => navigate("/products")} />
      <FeatureGrid features={features} />
    </>
  );
};

export default HomePage;
