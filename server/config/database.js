import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Check if environment variables for PostgreSQL are configured
const isDbConfigured = Boolean(
  process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE
)

let poolInstance = null

if (isDbConfigured) {
  const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
    database: process.env.PGDATABASE,
    ssl: process.env.PGHOST.includes('localhost') || process.env.PGHOST.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false }
  }
  poolInstance = new pg.Pool(config)
} else {
  // In-memory mock database store for automated testing and offline development
  let cars = [
    {
      id: 1,
      name: 'Flame Runner',
      exterior_color: 'flame_red',
      wheels: 'sport_18',
      roof: 'hardtop',
      interior: 'leather_black',
      powertrain: 'turbo_20',
      accessories: 'spoiler',
      total_price: 35100,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 2,
      name: 'Electric Cruiser',
      exterior_color: 'electric_blue',
      wheels: 'turbines_20',
      roof: 'panoramic',
      interior: 'suede_tan',
      powertrain: 'electric',
      accessories: 'none',
      total_price: 39500,
      created_at: new Date().toISOString()
    }
  ]
  let nextId = 3

  poolInstance = {
    async query(text, params = []) {
      const normalized = text.trim().toUpperCase()

      // GET SINGLE CAR BY ID
      if (normalized.includes('WHERE ID = $1') && normalized.startsWith('SELECT')) {
        const id = parseInt(params[0], 10)
        const car = cars.find((c) => c.id === id)
        return { rows: car ? [car] : [] }
      }

      // GET ALL CARS
      if (normalized.startsWith('SELECT * FROM CUSTOM_CARS')) {
        let rows = [...cars].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        return { rows }
      }

      // INSERT NEW CAR
      if (normalized.startsWith('INSERT INTO CUSTOM_CARS')) {
        const [name, exterior_color, wheels, roof, interior, powertrain, accessories, total_price] = params
        const newCar = {
          id: nextId++,
          name,
          exterior_color,
          wheels,
          roof,
          interior,
          powertrain,
          accessories: accessories || 'none',
          total_price: parseFloat(total_price),
          created_at: new Date().toISOString()
        }
        cars.push(newCar)
        return { rows: [newCar] }
      }

      // UPDATE CAR
      if (normalized.startsWith('UPDATE CUSTOM_CARS')) {
        const id = parseInt(params[params.length - 1], 10)
        const carIndex = cars.findIndex((c) => c.id === id)
        if (carIndex === -1) {
          return { rows: [] }
        }
        const [name, exterior_color, wheels, roof, interior, powertrain, accessories, total_price] = params
        const updatedCar = {
          ...cars[carIndex],
          name: name !== undefined ? name : cars[carIndex].name,
          exterior_color: exterior_color !== undefined ? exterior_color : cars[carIndex].exterior_color,
          wheels: wheels !== undefined ? wheels : cars[carIndex].wheels,
          roof: roof !== undefined ? roof : cars[carIndex].roof,
          interior: interior !== undefined ? interior : cars[carIndex].interior,
          powertrain: powertrain !== undefined ? powertrain : cars[carIndex].powertrain,
          accessories: accessories !== undefined ? accessories : cars[carIndex].accessories,
          total_price: total_price !== undefined ? parseFloat(total_price) : cars[carIndex].total_price
        }
        cars[carIndex] = updatedCar
        return { rows: [updatedCar] }
      }

      // DELETE CAR
      if (normalized.startsWith('DELETE FROM CUSTOM_CARS')) {
        const id = parseInt(params[0], 10)
        const carIndex = cars.findIndex((c) => c.id === id)
        if (carIndex === -1) {
          return { rows: [] }
        }
        const deletedCar = cars.splice(carIndex, 1)[0]
        return { rows: [deletedCar] }
      }

      return { rows: [] }
    }
  }
}

export const pool = poolInstance
