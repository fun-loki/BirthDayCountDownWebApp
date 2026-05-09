export async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url)
  if (!r.ok) {
    throw new Error(`Failed to load ${url} (${r.status})`)
  }
  return r.json() as Promise<T>
}
