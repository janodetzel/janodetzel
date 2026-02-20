import * as React from 'react'
import * as types from 'lib/types'
import { PageHead } from './PageHead'

import styles from './styles.module.css'
import Link from 'next/link'

export const Page404: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site?.name || 'Notion Page Not Found'

  return (
    <>
      <PageHead site={site} title={title} />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1 style={{ fontSize: 90, margin: 0 }}>404</h1>

          {error ? (
            <p>{error.message}</p>
          ) : (
            pageId && <p>Page {pageId} does not exist</p>
          )}
          <Link href={'/'}>
            <a className='notion-blue'>Go back home</a>
          </Link>

          <img
            src='/404.png'
            alt='404 Not Found'
            className={styles.errorImage}
          />
        </main>
      </div>
    </>
  )
}
