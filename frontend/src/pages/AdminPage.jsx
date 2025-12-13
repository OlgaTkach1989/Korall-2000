import { useEffect, useState } from "react";
import { fetchOrders, fetchProducts, updateOrderStatus } from "../api/shop";
import AdminDashboard from "../components/AdminDashboard";
import { sampleProducts } from "../data/sampleProducts";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(sampleProducts);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {});
    fetchOrders()
      .then(setOrders)
      .catch(() => {});
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    setIsAuthenticated(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      // ignore demo errors
    } finally {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status } : order)),
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="admin-login">
        <div className="auth-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <label>
              Email
              <input type="email" required />
            </label>
            <label>
              Passwort
              <input type="password" required />
            </label>
            <button className="primary" type="submit">
              Login
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <AdminDashboard
      orders={orders}
      products={products}
      onStatusChange={handleStatusChange}
      onProductChange={setProducts}
      onLogout={() => setIsAuthenticated(false)}
    />
  );
};

export default AdminPage;
