import { useState } from "react";

const fallbackImage =
  "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=900&q=60";

const ProductDetail = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAdd(product, quantity);
  };

  const image = product.image_url || product.imageUrl || fallbackImage;
  const rawPrice = product.minimum_price ?? product.price ?? 0;
  const price = Number(rawPrice) || 0;

  return (
    <section className="product-detail">
      <div className="product-detail__image">
        <img src={image} alt={product.name} />
      </div>
      <div className="product-detail__info">
        <p className="back-link">← Zurück zu Produkten</p>
        <h2>{product.name}</h2>
        <p className="price-hint">ab {price.toFixed(2)} € / Stück</p>
        <p>{product.description}</p>
        <label>
          Menge
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
        </label>
        <button className="primary" onClick={handleAdd}>
          In den Warenkorb
        </button>
      </div>
    </section>
  );
};

export default ProductDetail;
