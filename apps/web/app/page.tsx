import { getPublicIntegrationStatus } from '@/lib/integration-status';

const pathways = [
  {
    title: 'Learn',
    text: 'Understand one part of the buying process at a time before you feel pressured to search.'
  },
  {
    title: 'Plan',
    text: 'Identify a practical next step without treating a website result as approval or financial advice.'
  },
  {
    title: 'Explore',
    text: 'Prepare for compliant property search through an approved provider when that integration is ready.'
  },
  {
    title: 'Connect',
    text: 'Reach Debra when personalized real-estate guidance is the right next step.'
  }
];

export default function HomePage() {
  const integrationStatus = getPublicIntegrationStatus();

  return (
    <>
      <section className="hero" aria-labelledby="home-heading">
        <div>
          <p><strong>First-time buyer education</strong></p>
          <h1 id="home-heading">Homeownership has steps.</h1>
          <p className="lede">
            You do not have to learn them alone. D&apos;Affordable Homes helps renters and first-time buyers slow the process down, understand the path, and choose a clear next step.
          </p>
          <div className="actions" aria-label="Primary actions">
            <a className="button" href="/start">Find your next step</a>
            <a className="button secondary" href="/contact">Ask Debra a question</a>
          </div>
        </div>
      </section>

      <section aria-labelledby="pathways-heading">
        <h2 id="pathways-heading">Start with education, then move with a plan.</h2>
        <div className="grid">
          {pathways.map((pathway) => (
            <article className="card" key={pathway.title}>
              <h3>{pathway.title}</h3>
              <p>{pathway.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card" aria-labelledby="status-heading">
        <h2 id="status-heading">Integration readiness</h2>
        <p>{integrationStatus.message}</p>
      </section>
    </>
  );
}
