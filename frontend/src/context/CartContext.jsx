import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const exists = prev.find((entry) => entry.product.id === product.id);
      if (exists) {
        return prev.map((entry) =>
          entry.product.id === product.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry,
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((entry) => entry.product.id !== id));
  };

  const updateQuantity = (id, qty) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.product.id === id ? { ...entry, quantity: qty } : entry,
      ),
    );
  };

  const clear = () => setItems([]);

  const summary = useMemo(() => {
    const subtotal = items.reduce(
      (acc, entry) => acc + entry.product.price * entry.quantity,
      0,
    );
    const shipping = items.length ? 4 : 0;
    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, summary }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
