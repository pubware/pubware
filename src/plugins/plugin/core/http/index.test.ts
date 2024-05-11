import { jest } from '@jest/globals'
import HTTP from './index.js'

describe('HTTP', () => {
  const url = 'https://api.example.com/'

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('returns json when response is successful', async () => {
    const json = { message: 'Success' }
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(json),
      statusText: 'OK',
      status: 200
    } as Response)
    const http = new HTTP()
    const result = await http.fetch(url)

    expect(fetchSpy).toHaveBeenCalledWith(url, undefined)
    expect(result).toEqual(json)
  })

  test('throws error when response is not ok', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      status: 404,
      json: () => Promise.resolve({ message: 'Not found' })
    } as Response)
    const http = new HTTP()
    await expect(http.fetch(url)).rejects.toThrow('HTTP Error: 404 Not Found')
  })

  test('throws error on network failure', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network failure'))
    const http = new HTTP()
    await expect(http.fetch(url)).rejects.toThrow('Network failure')
  })
})
