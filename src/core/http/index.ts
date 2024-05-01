class HTTP {
  async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      return (await response.json()) as T
    } catch (err) {
      throw err
    }
  }
}

export default HTTP
