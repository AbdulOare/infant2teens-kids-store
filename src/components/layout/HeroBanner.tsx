import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Dress them in their best</h1>
        <p>Premium fashion for infants, toddlers, kids, and teens. Fast delivery across Nigeria.</p>
        <div className="hero-actions">
          <Link href="/browse" className="btn-primary">Shop now</Link>
          <Link href="/browse?age=infant" className="btn-secondary">New arrivals</Link>
        </div>
      </div>
    </section>
  );
}
