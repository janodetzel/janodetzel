import { Link } from '@tanstack/react-router'

export function DefaultCatchBoundary() {
  return (
    <div className="container" style={{ padding: '4rem 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
      <p style={{ color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>An error occurred. Please try again.</p>
      <Link to="/" style={{ color: 'var(--accent)' }}>Go home</Link>
    </div>
  )
}
