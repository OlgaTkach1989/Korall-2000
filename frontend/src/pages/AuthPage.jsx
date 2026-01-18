import { useState } from "react";
import { login, register } from "../api/shop";
import { useI18n } from "../context/I18nContext";

const AuthPage = () => {
  const { t } = useI18n();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        const response = await login({
          username: form.username,
          password: form.password,
        });
        setMessage(
          t("auth.welcome", {
            name: response.first_name || response.username,
          }),
        );
      } else {
        await register(form);
        setMessage(t("auth.registerSuccess"));
        setMode("login");
      }
    } catch (err) {
      setError(t("auth.actionFailed"));
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            {t("auth.login")}
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            {t("auth.register")}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label>
                {t("checkout.firstName")}
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                {t("checkout.lastName")}
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                {t("checkout.email")}
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          )}
          <label>
            {t("auth.username")}
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            {t("auth.password")}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button className="primary" type="submit">
            {mode === "login" ? t("auth.login") : t("auth.register")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AuthPage;
