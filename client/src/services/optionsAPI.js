const API_BASE = '/api/options'

export const getOptionsCatalog = async () => {
  const response = await fetch(API_BASE)
  if (!response.ok) {
    throw new Error('Failed to fetch options catalog')
  }
  return response.json()
}
