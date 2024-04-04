// TODO `fetch` requires Node 17.5 (unless we use a polyfill?)
export async function httpRequest<T>(url: string): Promise<T | undefined> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data: T = await response.json()

    return data
  } catch (err) {
    console.error(err)
  }
}
