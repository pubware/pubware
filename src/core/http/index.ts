class HTTP {
  static async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      const data: T = await response.json()

      return data
    } catch (err) {
      console.error(err)
      // Re-throw to allow consumer to handle error
      throw err
    }
  }
}

export default HTTP
