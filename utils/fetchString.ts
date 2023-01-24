export default async function fetchString(link: string) {
  const res = await fetch(link)
  if (!res.ok) {
    throw new Error('Network response not OK!')
  }

  return res.text()
}