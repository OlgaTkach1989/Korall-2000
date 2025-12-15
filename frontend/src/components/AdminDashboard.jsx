import { useState } from "react";

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
  onLogout,
}) => {
  const [draftProducts, setDraftProducts] = useState(products);
  const [activeTab, setActiveTab] = useState("Dashboard");

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
            <article>Neue Bestellungen: {orders.filter((o) => o.status === "new").length}</article>
            <article>Offene Bestellungen: {orders.filter((o) => o.status !== "completed").length}</article>
            <article>Umsatz heute: 240 €</article>
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
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.toString().padStart(4, "0")}</td>
                    <td>
                      {order.first_name} {order.last_name}
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
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
                    </td>
                    <td>
                      {order.items
                        ?.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
                        .toFixed(2)}{" "}
                      €
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
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {["Einstellungen", "Abmelden"].includes(activeTab) && (
          <div className="admin-placeholder">
            Inhalte für „{activeTab}“ können hier ergänzt werden.
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
