import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHomepageFeatures, fetchProducts } from "../api/shop";
import FeatureGrid from "../components/FeatureGrid";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { sampleProducts } from "../data/sampleProducts";

const HomePage = () => {
  const [features, setFeatures] = useState([]);
  const [products, setProducts] = useState(sampleProducts);
  const navigate = useNavigate();
  const { addItem } = useCart();

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

    fetchProducts()
      .then(setProducts)
      .catch(() => {});
  }, []);

  return (
    <>
      <HeroSection onCTAClick={() => navigate("/products")} />
      <FeatureGrid features={features} />
      <section className="product-list">
        <h2>Unsere Produkte</h2>
        <div className="grid">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              onSelect={() => navigate(`/products/${product.slug}`)}
              onAdd={() => addItem(product)}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
