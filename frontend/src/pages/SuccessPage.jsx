import { Link } from "react-router-dom";

const SuccessPage = () => (
  <section className="success-page">
    <div className="success-card">
      <p className="icon">✓</p>
      <h2>Danke für Ihre Bestellung!</h2>
      <p>Ihre Bestellnummer: #{Math.floor(Math.random() * 9000 + 1000)}</p>
      <Link to="/" className="primary">
        Zur Startseite
      </Link>
    </div>
  </section>
);

export default SuccessPage;
