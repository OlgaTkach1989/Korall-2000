import heroImage from "../assets/HomeSeite.jpg";

const HeroSection = ({ onCTAClick }) => (
  <section className="hero" style={{ "--hero-image": `url(${heroImage})` }}>
    <div>
      <p className="hero-eyebrow">Korall 2000 – Plastiktüten & Verpackungen</p>
      <h1>Hochwertige Verpackungslösungen direkt vom Hersteller.</h1>
      <button className="primary" onClick={onCTAClick}>
        Produkte ansehen
      </button>
    </div>
  </section>
);

export default HeroSection;
