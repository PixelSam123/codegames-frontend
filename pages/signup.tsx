import { ChangeEventHandler, MouseEventHandler, useState } from "react"
import { useLocalStorage } from "react-use"

export default function Signup() {
  const [serverUrl, setServerUrl] = useLocalStorage('serverUrl', 'http://127.0.0.1:8080')
  const serverUrlOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setServerUrl(event.target.value)
  }

  const [username, setUsername] = useState('')
  const usernameOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setUsername(event.target.value)
  }

  const [password, setPassword] = useState('')
  const passwordOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPassword(event.target.value)
  }

  const [signupStatus, setSignupStatus] = useState('Waiting for sign up attempt.')

  const submitOnClick: MouseEventHandler<HTMLButtonElement> = () => {
    setSignupStatus('Submitting...')

    fetch(
      serverUrl + '/user/v1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: username,
          password
        })
      }
    )
      .then(async res => {
        if (!res.ok) {
          throw new Error(await res.text())
        }
      })
      .then(() => {
        setSignupStatus('Successfully signed up')
      })
      .catch(err => {
        setSignupStatus('Sign up error: ' + err.message)
      })
  }

  return (
    <>
      <input 
        value={serverUrl}
        onChange={serverUrlOnChange}
        type="text"
        placeholder="Server URL"
      />

      <h3>Sign Up</h3>
      <p>
        If you see this text it likely means the server is still running with
        <strong> Basic auth over HTTP!</strong> So please please don&apos;t use your real credentials.
      </p>

      <input
        value={username}
        onChange={usernameOnChange}
        type="text"
        placeholder="Username"
      />
      <input
        value={password}
        onChange={passwordOnChange}
        type="password"
        placeholder="Password"
      />
      <button onClick={submitOnClick}>Submit</button>
      <p>{signupStatus}</p>
    </>
  )
}