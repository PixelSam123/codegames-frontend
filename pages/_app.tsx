import type { AppProps } from 'next/app'
import '@picocss/pico'
import '@/styles/globals.css'
import Link from 'next/link'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <nav className="container">
        <ul>
          <li><strong><Link href="/">codegames</Link></strong></li>
        </ul>
        <ul>
          <li><Link href="/battle">JSbattle</Link></li>
          <li><Link href="/signup" role="button">Sign Up</Link></li>
        </ul>
      </nav>
      <main className="container">
        <Component {...pageProps} />
      </main>
    </>
  )
}
