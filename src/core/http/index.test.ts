import HTTP from './index.js'

global.fetch = jest.fn()

describe('HTTP', () => {
  const url = 'https://example.com/data'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns json when response is successful', async () => {
    const json = { message: 'Success' }
    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(json),
      statusText: 'OK',
      status: 200
    } as Response)

    const http = new HTTP()
    const result = await http.fetch(url)

    expect(fetch).toHaveBeenCalledWith(url, undefined)
    expect(result).toEqual(json)
  })

  test('throws error when response is not ok', async () => {
    expect(async () => {
      jest.mocked(fetch).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' })
      } as Response)

      const http = new HTTP()
      await http.fetch(url)
    }).rejects.toThrow('HTTP Error: 404 Not Found')
  })

  test('throws error on network failure', async () => {
    expect(async () => {
      jest.mocked(fetch).mockRejectedValue(new Error('Network failure'))

      const http = new HTTP()
      await http.fetch(url)
    }).rejects.toThrow('Network failure')
  })
})
