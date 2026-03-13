import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">KidStore</span>
          <p>Premium kids fashion delivered across Nigeria.</p>
        </div>
        <nav className="footer-links">
          <Link href="/browse">Shop all</Link>
          <Link href="/browse?age=infant">Infant</Link>
          <Link href="/browse?age=toddler">Toddler</Link>
          <Link href="/browse?age=kids">Kids</Link>
          <Link href="/browse?age=teens">Teens</Link>
        </nav>
        <div className="footer-contact">
          <p>Questions? Chat us on WhatsApp</p>
          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open WhatsApp
          </a>
        </div>
      </div>
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} KidStore. All rights reserved.
      </p>
    </footer>
  );
}
