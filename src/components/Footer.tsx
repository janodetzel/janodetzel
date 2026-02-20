import { Link } from '@tanstack/react-router'
import { site } from '~/config'

export function Footer() {
  return (
    <footer style={{ marginTop: '3rem', padding: '1.5rem 0', borderTop: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--fg-muted)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/">© {new Date().getFullYear()} {site.author}</Link>
          {' · '}
          <Link to="/site-notice">Site notice</Link>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {site.twitter && (
            <a href={`https://twitter.com/${site.twitter}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              Twitter
            </a>
          )}
          {site.github && (
            <a href={`https://github.com/${site.github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              GitHub
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
