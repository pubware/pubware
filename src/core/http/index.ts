class HTTP {
  static async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      const data: T = await response.json()

      return data
    } catch (err) {
      throw err
    }
  }
}

export default HTTP
