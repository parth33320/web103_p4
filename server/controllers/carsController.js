import { pool } from '../config/database.js'
import { checkServerIncompatibility, calculateServerTotalPrice } from '../config/optionsCatalog.js'

// GET /api/cars - Get all saved custom cars
export const getAllCars = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM custom_cars ORDER BY created_at DESC')
    return res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error in getAllCars:', error)
    return res.status(500).json({ error: 'Failed to retrieve custom cars' })
  }
}

// GET /api/cars/:id - Get a single custom car by ID
export const getCarById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('SELECT * FROM custom_cars WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Custom car not found' })
    }
    return res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('Error in getCarById:', error)
    return res.status(500).json({ error: 'Failed to retrieve custom car' })
  }
}

// POST /api/cars - Create a new custom car
export const createCar = async (req, res) => {
  const { name, exterior_color, wheels, roof, interior, powertrain, accessories } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Custom car name is required' })
  }

  // Validate impossible combinations
  const incompatibilityError = checkServerIncompatibility({
    roof,
    accessories,
    wheels,
    powertrain
  })

  if (incompatibilityError) {
    return res.status(400).json({ error: incompatibilityError })
  }

  const totalPrice = calculateServerTotalPrice({
    exteriorColor: exterior_color,
    wheels,
    roof,
    interior,
    powertrain,
    accessories
  })

  try {
    const insertQuery = `
      INSERT INTO custom_cars (name, exterior_color, wheels, roof, interior, powertrain, accessories, total_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `
    const values = [
      name.trim(),
      exterior_color || 'flame_red',
      wheels || 'sport_18',
      roof || 'hardtop',
      interior || 'leather_black',
      powertrain || 'turbo_20',
      accessories || 'none',
      totalPrice
    ]

    const result = await pool.query(insertQuery, values)
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error in createCar:', error)
    return res.status(500).json({ error: 'Failed to create custom car' })
  }
}

// PATCH /api/cars/:id - Update an existing custom car
export const updateCar = async (req, res) => {
  const { id } = req.params
  const { name, exterior_color, wheels, roof, interior, powertrain, accessories } = req.body

  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ error: 'Custom car name cannot be empty' })
  }

  // Check impossible combinations
  const incompatibilityError = checkServerIncompatibility({
    roof,
    accessories,
    wheels,
    powertrain
  })

  if (incompatibilityError) {
    return res.status(400).json({ error: incompatibilityError })
  }

  const totalPrice = calculateServerTotalPrice({
    exteriorColor: exterior_color,
    wheels,
    roof,
    interior,
    powertrain,
    accessories
  })

  try {
    const updateQuery = `
      UPDATE custom_cars
      SET name = $1, exterior_color = $2, wheels = $3, roof = $4, interior = $5, powertrain = $6, accessories = $7, total_price = $8
      WHERE id = $9
      RETURNING *
    `
    const values = [
      name ? name.trim() : 'Updated Custom Car',
      exterior_color,
      wheels,
      roof,
      interior,
      powertrain,
      accessories || 'none',
      totalPrice,
      id
    ]

    const result = await pool.query(updateQuery, values)
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Custom car not found for update' })
    }
    return res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('Error in updateCar:', error)
    return res.status(500).json({ error: 'Failed to update custom car' })
  }
}

// DELETE /api/cars/:id - Delete a custom car by ID
export const deleteCar = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM custom_cars WHERE id = $1 RETURNING *', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Custom car not found for deletion' })
    }
    return res.status(200).json({ message: 'Custom car deleted successfully', id: result.rows[0].id })
  } catch (error) {
    console.error('Error in deleteCar:', error)
    return res.status(500).json({ error: 'Failed to delete custom car' })
  }
}
