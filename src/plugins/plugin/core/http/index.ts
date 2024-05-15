/**
 * Class responsible for HTTP requests.
 */
class HTTP {
  /**
   * Fetch data from a URL and returns the data as a JSON object.
   * @template T The type of the data expected to be returned from the fetch call.
   * @param {string} url The URL to fetch data from.
   * @param {RequestInit} [options] The options for the fetch request, such as headers, method, etc.
   * @returns {Promise<T>} A promise that resolves with the JSON-converted response.
   * @throws {Error} Throws an error if the fetch operation fails or if the response is not ok.
   */
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
