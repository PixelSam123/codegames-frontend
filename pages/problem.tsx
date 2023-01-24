import Link from 'next/link'
import useSWR from 'swr'
import Editor, { OnChange } from '@monaco-editor/react'
import { useRouter } from 'next/router'
import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import fetchJson from '@/utils/fetchJson'

interface ProblemDetailedView {
  title: string
  description: string
  initialCode: string
}

interface SubmissionRunResult {
  status: 'ACCEPTED' | 'COMPILE_ERROR' | 'RUNTIME_ERROR'
  stdout: string
}

export default function Problem() {
  const router = useRouter()
  const { id, url } = router.query

  const problemQueryUrl = url + '/problems/v1/problem/' + id
  const problemQuery = useSWR(
    [problemQueryUrl],
    () => fetchJson<ProblemDetailedView>(problemQueryUrl)
  )

  const [codeToSubmit, setCodeToSubmit] = useState('')
  const editorOnChange: OnChange = (code) => {
    setCodeToSubmit(code ?? '')
  }
  useEffect(() => {
    if (typeof problemQuery.data !== 'undefined') {
      setCodeToSubmit(problemQuery.data.initialCode)
    }
  }, [problemQuery.data])

  const [username, setUsername] = useState('')
  const usernameOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setUsername(event.target.value)
  }

  const [password, setPassword] = useState('')
  const passwordOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPassword(event.target.value)
  }

  const [submissionStatus, setSubmissionStatus] = useState<string>(
    'You have not submitted'
  )
  const [runResult, setRunResult] = useState<SubmissionRunResult | null>(null)

  const submitOnClick: MouseEventHandler<HTMLButtonElement> = () => {
    setSubmissionStatus('Submitting...')

    const headers: HeadersInit = {}
    if (username.length > 0 || password.length > 0) {
      headers['Authorization'] = 'Basic ' + btoa(username + ':' + password)
    }

    fetch(
      url + '/problems/v1/submission/' + id,
      {
        method: 'POST',
        headers,
        body: codeToSubmit
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response not OK! ' + res.status + ' ' + res.statusText)
        }

        return res.json() as Promise<SubmissionRunResult>
      })
      .then(runResult => {
        setSubmissionStatus('Successfully submitted')
        setRunResult(runResult)
      })
      .catch(err => {
        setSubmissionStatus('Submission error: ' + err.message)
        setRunResult(null)
      })
  }

  return (
    <>
      <h3>
        {problemQuery.data?.title ?? (problemQuery.isLoading ? 'Loading...' : 'Error')}
      </h3>

      <Link href={'/submission?url=' + url + '&id=' + id}>View submissions for this challenge</Link>

      <p>{problemQuery.error?.message ?? ''}</p>
      <p style={{whiteSpace: 'pre-wrap'}}>
        {problemQuery.data?.description ?? ''}
      </p>
      <Editor 
        value={codeToSubmit}
        onChange={editorOnChange}
        height="24rem"
        defaultLanguage="javascript"
        theme="vs-dark"
      />

      <p>You can submit without username and password but your submission won&apos;t be saved.</p>
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

      {runResult ? (
        <article style={{whiteSpace: 'pre-wrap'}}>
          <header>{runResult.status}</header>
          <code style={{color: 'lightgray'}}>{runResult.stdout}</code>
        </article>
      ) : <p>{submissionStatus}</p>}
    </>
  )
}
