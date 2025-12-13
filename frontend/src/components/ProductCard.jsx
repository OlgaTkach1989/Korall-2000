const fallbackImage =
  "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=600&q=60";

const ProductCard = ({ product, onSelect, onAdd }) => {
  const rawPrice = product.minimum_price ?? product.price ?? 0;
  const price = Number(rawPrice) || 0;
  const image = product.image_url || product.imageUrl || fallbackImage;

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="price-hint">ab {price.toFixed(2)} €</p>
        <div className="product-actions">
          <button className="ghost" onClick={() => onSelect(product)}>
            Details
          </button>
          <button className="primary" onClick={() => onAdd(product)}>
            In den Warenkorb
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
