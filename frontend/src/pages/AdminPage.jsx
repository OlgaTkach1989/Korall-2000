import { useEffect, useState } from "react";
import { deleteOrder, fetchOrders, fetchProducts, login, updateOrderStatus } from "../api/shop";
import AdminDashboard from "../components/AdminDashboard";
import { sampleProducts } from "../data/sampleProducts";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(sampleProducts);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {});
    if (isAuthenticated) {
      fetchOrders()
        .then(setOrders)
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await login({ email, username: email, password });
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
    } catch (err) {
      setError("Kein Zugriff. Nur freigegebene Manager/Superuser.");
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, is_deleted: true } : order)),
      );
    } catch (err) {
      // ignore demo errors
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
              <input type="email" name="email" required />
            </label>
            <label>
              Passwort
              <input type="password" name="password" required />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="primary" type="submit">
              {loading ? "Login..." : "Login"}
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
      onDeleteOrder={handleDelete}
      onLogout={() => setIsAuthenticated(false)}
    />
  );
};

export default AdminPage;
