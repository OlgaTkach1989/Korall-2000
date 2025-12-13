import { useState } from "react";
import { login, register } from "../api/shop";

const AuthPage = () => {
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
        setMessage(`Willkommen zurück, ${response.first_name || response.username}!`);
      } else {
        await register(form);
        setMessage("Registrierung erfolgreich! Sie können sich jetzt anmelden.");
        setMode("login");
      }
    } catch (err) {
      setError("Aktion fehlgeschlagen. Bitte Eingaben prüfen.");
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
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Registrieren
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label>
                Vorname
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Nachname
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email
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
            Nutzername
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Passwort
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
            {mode === "login" ? "Anmelden" : "Registrieren"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AuthPage;
