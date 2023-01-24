export default async function fetchJson<T>(link: string) {
  const res = await fetch(link)
  if (!res.ok) {
    throw new Error('Network response not OK!')
  }

  return res.json() as Promise<T>
}