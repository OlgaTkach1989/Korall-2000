const FeatureCard = ({ title, description }) => (
  <article className="feature-card">
    <h3>{title}</h3>
    <p>{description}</p>
  </article>
);

const FeatureGrid = ({ features }) => (
  <section className="feature-grid">
    {features.map((feature) => (
      <FeatureCard key={feature.title} {...feature} />
    ))}
  </section>
);

export default FeatureGrid;
