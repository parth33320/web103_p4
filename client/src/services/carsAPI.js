const API_BASE = '/api/cars'

export const getAllCars = async () => {
  const response = await fetch(API_BASE)
  if (!response.ok) {
    throw new Error('Failed to fetch custom cars')
  }
  return response.json()
}

export const getCarById = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch car with ID ${id}`)
  }
  return response.json()
}

export const createCar = async (carData) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create custom car')
  }
  return data
}

export const updateCar = async (id, carData) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update custom car')
  }
  return data
}

export const deleteCar = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete custom car')
  }
  return data
}
