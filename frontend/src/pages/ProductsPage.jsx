import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, fetchProducts } from "../api/shop";
import ProductCard from "../components/ProductCard";
import ProductDetail from "../components/ProductDetail";
import { useCart } from "../context/CartContext";
import { sampleProducts } from "../data/sampleProducts";

const ProductsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState(sampleProducts);
  const [selected, setSelected] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug) {
      setSelected(null);
      return;
    }
    fetchProduct(slug)
      .then(setSelected)
      .catch(() => {
        const fallback = sampleProducts.find((product) => product.slug === slug);
        if (fallback) setSelected(fallback);
      });
  }, [slug]);

  const handleSelect = (product) => {
    setSelected(product);
    if (product?.slug) {
      navigate(`/products/${product.slug}`);
    }
  };

  return (
    <section className="product-page">
      {!slug ? (
        <>
          <h2>Unsere Produkte</h2>
          <div className="grid">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                onSelect={handleSelect}
                onAdd={addItem}
              />
            ))}
          </div>
          {selected ? (
            <ProductDetail product={selected} onAdd={addItem} />
          ) : (
            <p className="muted">Wählen Sie ein Produkt für weitere Details.</p>
          )}
        </>
      ) : (
        <ProductDetail product={selected} onAdd={addItem} />
      )}
    </section>
  );
};

export default ProductsPage;
