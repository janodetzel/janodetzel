import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="container" style={{ padding: '4rem 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>This page doesn't exist.</p>
      <Link to="/" style={{ color: 'var(--accent)' }}>Go home</Link>
    </div>
  )
}
