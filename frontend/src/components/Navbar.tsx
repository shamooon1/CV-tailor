import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="glass-panel">
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ margin: 0 }}>CV Tailor</h2>
      </Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/resumes" className="btn btn-secondary">Base Resumes</Link>
        <Link href="/generate" className="btn btn-primary">Generate</Link>
      </div>
    </nav>
  );
}
