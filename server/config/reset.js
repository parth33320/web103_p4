import { pool } from './database.js'

export const createCustomCarsTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS custom_cars;

    CREATE TABLE IF NOT EXISTS custom_cars (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      exterior_color VARCHAR(50) NOT NULL,
      wheels VARCHAR(50) NOT NULL,
      roof VARCHAR(50) NOT NULL,
      interior VARCHAR(50) NOT NULL,
      powertrain VARCHAR(50) NOT NULL,
      accessories VARCHAR(50) DEFAULT 'none',
      total_price NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await pool.query(createTableQuery)
    console.log('🎉 custom_cars table created successfully')
  } catch (err) {
    console.error('⚠️ Error creating custom_cars table', err)
  }
}

export const seedCustomCarsTable = async () => {
  await createCustomCarsTable()

  const seedCarsQuery = `
    INSERT INTO custom_cars (name, exterior_color, wheels, roof, interior, powertrain, accessories, total_price)
    VALUES
      ('Flame Runner', 'flame_red', 'sport_18', 'hardtop', 'leather_black', 'turbo_20', 'spoiler', 35100.00),
      ('Electric Cruiser', 'electric_blue', 'turbines_20', 'panoramic', 'suede_tan', 'electric', 'none', 39500.00)
  `

  try {
    await pool.query(seedCarsQuery)
    console.log('🎉 Seeded custom_cars table successfully')
  } catch (err) {
    console.error('⚠️ Error seeding custom_cars table', err)
  }
}

// Execute if run directly via `node server/config/reset.js`
if (process.argv[1]?.endsWith('reset.js')) {
  seedCustomCarsTable().then(() => {
    console.log('Database reset script completed.')
    process.exit(0)
  }).catch((err) => {
    console.error('Database reset failed:', err)
    process.exit(1)
  })
}
