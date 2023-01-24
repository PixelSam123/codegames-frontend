import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import { useLocalStorage } from 'react-use'
import { ChangeEventHandler } from 'react'
import fetchJson from '@/utils/fetchJson'

interface UserPreview {
  name: string
  acceptedSubmissionCount: number
}

interface ProblemPreview {
  title: string
  description: string
}

export default function Home() {
  const [serverUrl, setServerUrl] = useLocalStorage('serverUrl', 'http://127.0.0.1:8080')
  const serverUrlOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setServerUrl(event.target.value)
  }

  const usersQueryUrl = serverUrl + '/user/v1'
  const usersQuery = useSWR(
    [usersQueryUrl],
    () => fetchJson<UserPreview[]>(usersQueryUrl)
  )

  const problemsQueryUrl = serverUrl + '/problems/v1/problem'
  const problemsQuery = useSWR(
    [problemsQueryUrl],
    () => fetchJson<ProblemPreview[]>(problemsQueryUrl)
  )

  return (
    <>
      <Head>
        <title>Codegames - home</title>
      </Head>
      <input 
        value={serverUrl}
        onChange={serverUrlOnChange}
        type="text"
        placeholder="Server URL"
      />
      <h3>Leaderboard</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Accepted Submission Count</th>
          </tr>
        </thead>
        <tbody>
          {usersQuery.data?.map(user => (
            <tr key={user.name}>
              <th scope="row">{user.name}</th>
              <td>{user.acceptedSubmissionCount}</td>
            </tr>
          )) ?? (
            <tr>
              <th scope="row">{usersQuery.isLoading ? 'Loading...' : 'Error'}</th>
              <td>{usersQuery.error?.message ?? ''}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Problems</h3>
      {problemsQuery.data?.map((problem, idx) => (
        <article key={problem.title} style={{whiteSpace: 'pre-wrap'}}>
          <header>{problem.title}</header>
          {problem.description}
          <Link href={'/problem/?url=' + serverUrl + '&id=' + idx}>
            <button>Go</button>
          </Link>
        </article>
      )) ?? (
        <>
          <p>{usersQuery.isLoading ? 'Loading...' : 'Error'}</p>
          <p>{usersQuery.error?.message ?? ''}</p>
        </>
      )}
    </>
  )
}
