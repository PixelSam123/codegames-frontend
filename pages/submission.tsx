import useSWR from 'swr'
import { useRouter } from 'next/router'
import fetchJson from '@/utils/fetchJson'

interface Submission {
  username: string
  content: string
  status: string
}

export default function Submission() {
  const router = useRouter()
  const { id, url } = router.query

  const submissionsQueryUrl = url + '/problems/v1/submission/' + id
  const submissionsQuery = useSWR(
    [submissionsQueryUrl],
    () => fetchJson<Submission[]>(submissionsQueryUrl)
  )

  return (
    <>
      <h3>Submissions for this challenge</h3>
      {submissionsQuery.data?.map(submission => (
        <article key={submission.username + submission.status + submission.content}>
          <header>{submission.username}: {submission.status}</header>
          <pre>
            <code style={{color: 'lightgray'}}>{submission.content}</code>
          </pre>
        </article>
      )) ?? (
        <>
          <p>{submissionsQuery.isLoading ? 'Loading...' : 'Error'}</p>
          <p>{submissionsQuery.error?.message ?? ''}</p>
        </>
      )}
    </>
  )
}