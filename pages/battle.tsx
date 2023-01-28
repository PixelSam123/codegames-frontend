import type { ChangeEventHandler } from 'react'
import { useLocalStorage } from 'react-use'

export default function Battle() {
  const [serverUrl, setServerUrl] = useLocalStorage('serverUrl', 'http://127.0.0.1:8080')
  const serverUrlOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setServerUrl(event.target.value)
  }

  return (
    <>
      <input
        value={serverUrl}
        onChange={serverUrlOnChange}
        type="text"
        placeholder="Server URL"
      />
      <h3>JS Battle (placeholder rn)</h3>
      <p>You must be signed up to play.</p>
      <p>Room name:</p>
      <input type="text" />
      <button>Go</button>
    </>
  )
}
