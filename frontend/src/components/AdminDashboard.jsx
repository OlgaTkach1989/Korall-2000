import { useMemo, useState } from "react";

const statusLabels = {
  new: "Neu",
  processing: "In Bearbeitung",
  shipped: "Versandt",
  completed: "Abgeschlossen",
};

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
  const [draftProducts, setDraftProducts] = useState(products);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const orderTotal = (order) =>
    order.items?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0) || 0;

  const metrics = useMemo(() => {
    const newOrders = orders.filter((o) => o.status === "new" && !o.is_deleted).length;
    const openOrders = orders.filter((o) => o.status !== "completed" && !o.is_deleted).length;
    const deletedOrders = orders.filter((o) => o.is_deleted).length;
    const revenueToday = orders.reduce((sum, o) => sum + orderTotal(o), 0);
    return { newOrders, openOrders, deletedOrders, revenueToday };
  }, [orders]);

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
          {["Dashboard", "Produkte", "Bestellungen", "Logistik", "Einstellungen"].map((item) => (
            <li
              key={item}
              className={item === activeTab ? "active" : ""}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </li>
          ))}
          <li className="logout" onClick={onLogout}>
            Abmelden
          </li>
        </ul>
      </aside>
      <section>
        {activeTab === "Dashboard" && (
          <div className="admin-metrics">
            <article>Neue Bestellungen: {metrics.newOrders}</article>
            <article>Offene Bestellungen: {metrics.openOrders}</article>
            <article>Gelöschte Bestellungen: {metrics.deletedOrders}</article>
            <article>Umsatz heute: {metrics.revenueToday.toFixed(2)} EUR</article>
          </div>
        )}

        {activeTab === "Bestellungen" && (
          <div className="admin-orders">
            <h3>Bestellungen</h3>
            <table>
              <thead>
                <tr>
                  <th>Nr</th>
                  <th>Kunde</th>
                  <th>Datum</th>
                  <th>Status</th>
                  <th>Gesamt</th>
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
                        <span className="badge gray">Gelöscht</span>
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
                          Löschen
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Produkte" && (
          <div className="admin-products">
            <h3>Produkte verwalten</h3>
            <div className="product-editor">
              {draftProducts.map((product) => (
                <article key={product.id}>
                  <h4>{product.name}</h4>
                  <label>
                    Preis
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
                    Mindestpreis
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

        {activeTab === "Logistik" && (
          <div className="admin-orders">
            <h3>Lieferungen / Logistik</h3>
            <table>
              <thead>
                <tr>
                  <th>Nr</th>
                  <th>Kunde</th>
                  <th>Lieferart</th>
                  <th>Adresse / Abholung</th>
                  <th>Status</th>
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
                    <td>{order.delivery_type === "pickup" ? "Abholung" : "Lieferung"}</td>
                    <td>
                      {order.delivery_type === "pickup"
                        ? "Abholung vor Ort"
                        : `${order.street} ${order.house_number}, ${order.postal_code} ${order.city}`}
                    </td>
                    <td>
                      {order.is_deleted ? (
                        <span className="badge gray">Gelöscht</span>
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
                          Löschen
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {["Einstellungen", "Abmelden"].includes(activeTab) && (
          <div className="admin-placeholder">
            Inhalte fuer "{activeTab}" koennen hier ergaenzt werden.
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
