import type { AppProps } from 'next/app'
import '@picocss/pico'
import '@/styles/globals.css'
import Link from 'next/link'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <nav className="container">
        <ul>
          <li><Link href="/">codegames</Link></li>
        </ul>
      </nav>
      <Component {...pageProps} />
    </>
  )
}
