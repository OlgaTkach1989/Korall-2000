import { useMemo, useState } from "react";
import { useI18n } from "../context/I18nContext";

const statusPalette = {
  new: "badge yellow",
  processing: "badge blue",
  shipped: "badge purple",
  completed: "badge green",
};

const AdminDashboard = ({
  orders = [],
  products = [],
  onStatusChange,
  onProductChange,
  onDeleteOrder,
  onLogout,
}) => {
  const { t } = useI18n();
  const [draftProducts, setDraftProducts] = useState(products);
  const [activeTab, setActiveTab] = useState("dashboard");

  const orderTotal = (order) =>
    order.items?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) || 0;

  const metrics = useMemo(() => {
    const newOrders = orders.filter((o) => o.status === "new" && !o.is_deleted).length;
    const openOrders = orders.filter((o) => o.status !== "completed" && !o.is_deleted).length;
    const deletedOrders = orders.filter((o) => o.is_deleted).length;
    const revenueToday = orders.reduce((sum, o) => sum + orderTotal(o), 0);
    return { newOrders, openOrders, deletedOrders, revenueToday };
  }, [orders]);

  const statusLabels = {
    new: t("status.new"),
    processing: t("status.processing"),
    shipped: t("status.shipped"),
    completed: t("status.completed"),
  };

  const tabs = [
    { key: "dashboard", label: t("admin.dashboard") },
    { key: "products", label: t("admin.products") },
    { key: "orders", label: t("admin.orders") },
    { key: "logistics", label: t("admin.logistics") },
    { key: "settings", label: t("admin.settings") },
  ];

  const handleProductChange = (id, key, value) => {
    const next = draftProducts.map((product) =>
      product.id === id ? { ...product, [key]: value } : product,
    );
    setDraftProducts(next);
    onProductChange?.(next);
  };

  return (
    <div className="admin-shell">
      <aside>
        <ul>
          {tabs.map((item) => (
            <li
              key={item.key}
              className={item.key === activeTab ? "active" : ""}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </li>
          ))}
          <li className="logout" onClick={onLogout}>
            {t("admin.logout")}
          </li>
        </ul>
      </aside>
      <section>
        {activeTab === "dashboard" && (
          <div className="admin-metrics">
            <article>
              {t("admin.newOrders")}: {metrics.newOrders}
            </article>
            <article>
              {t("admin.openOrders")}: {metrics.openOrders}
            </article>
            <article>
              {t("admin.deletedOrders")}: {metrics.deletedOrders}
            </article>
            <article>
              {t("admin.revenueToday")}: {metrics.revenueToday.toFixed(2)} EUR
            </article>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="admin-orders">
            <h3>{t("admin.orders")}</h3>
            <table>
              <thead>
                <tr>
                  <th>{t("admin.number")}</th>
                  <th>{t("admin.customer")}</th>
                  <th>{t("admin.date")}</th>
                  <th>{t("admin.status")}</th>
                  <th>{t("admin.total")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className={order.is_deleted ? "is-deleted" : ""}>
                    <td>{order.id.toString().padStart(4, "0")}</td>
                    <td>
                      {order.first_name} {order.last_name}
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      {order.is_deleted ? (
                        <span className="badge gray">{t("admin.deleted")}</span>
                      ) : (
                        <select
                          className={statusPalette[order.status]}
                          value={order.status}
                          onChange={(event) => onStatusChange?.(order.id, event.target.value)}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option value={value} key={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>{orderTotal(order).toFixed(2)} EUR</td>
                    <td>
                      {order.status === "completed" && !order.is_deleted ? (
                        <button className="ghost danger" onClick={() => onDeleteOrder?.(order.id)}>
                          {t("admin.delete")}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "products" && (
          <div className="admin-products">
            <h3>{t("admin.manageProducts")}</h3>
            <div className="product-editor">
              {draftProducts.map((product) => (
                <article key={product.id}>
                  <h4>{product.name}</h4>
                  <label>
                    {t("admin.productLabel")}
                    <input
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(event) =>
                        handleProductChange(product.id, "price", Number(event.target.value))
                      }
                    />
                  </label>
                  <label>
                    {t("admin.minPriceLabel")}
                    <input
                      type="number"
                      step="0.01"
                      value={product.minimum_price}
                      onChange={(event) =>
                        handleProductChange(product.id, "minimum_price", Number(event.target.value))
                      }
                    />
                  </label>
                  <textarea
                    value={product.description}
                    onChange={(event) =>
                      handleProductChange(product.id, "description", event.target.value)
                    }
                  />
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "logistics" && (
          <div className="admin-orders">
            <h3>{t("admin.deliveries")}</h3>
            <table>
              <thead>
                <tr>
                  <th>{t("admin.number")}</th>
                  <th>{t("admin.customer")}</th>
                  <th>{t("admin.deliveryType")}</th>
                  <th>{t("admin.addressPickup")}</th>
                  <th>{t("admin.status")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className={order.is_deleted ? "is-deleted" : ""}>
                    <td>{order.id.toString().padStart(4, "0")}</td>
                    <td>
                      {order.first_name} {order.last_name}
                    </td>
                    <td>
                      {order.delivery_type === "pickup"
                        ? t("checkout.pickup")
                        : t("checkout.delivery")}
                    </td>
                    <td>
                      {order.delivery_type === "pickup"
                        ? t("admin.addressPickupValue")
                        : `${order.street} ${order.house_number}, ${order.postal_code} ${order.city}`}
                    </td>
                    <td>
                      {order.is_deleted ? (
                        <span className="badge gray">{t("admin.deleted")}</span>
                      ) : (
                        <select
                          className={statusPalette[order.status]}
                          value={order.status}
                          onChange={(event) => onStatusChange?.(order.id, event.target.value)}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option value={value} key={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      {order.status === "completed" && !order.is_deleted ? (
                        <button className="ghost danger" onClick={() => onDeleteOrder?.(order.id)}>
                          {t("admin.delete")}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="admin-placeholder">
            {t("admin.placeholder", { tab: t("admin.settings") })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
