import test from 'node:test'
import assert from 'node:assert'
import app from '../server.js'

let server
let baseUrl

test('API Endpoints Suite', async (t) => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port
      baseUrl = `http://localhost:${port}`
      resolve()
    })
  })

  t.after(() => {
    if (server) {
      server.close()
    }
  })

  await t.test('GET /api/options returns options catalog', async () => {
    const res = await fetch(`${baseUrl}/api/options`)
    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert.strictEqual(data.basePrice, 30000)
    assert.ok(data.categories.exteriorColor)
    assert.ok(data.impossibleCombos)
  })

  await t.test('GET /api/cars returns list of custom cars', async () => {
    const res = await fetch(`${baseUrl}/api/cars`)
    assert.strictEqual(res.status, 200)
    const cars = await res.json()
    assert.ok(Array.isArray(cars))
    assert.ok(cars.length >= 2)
  })

  await t.test('POST /api/cars creates a valid custom car', async () => {
    const newCar = {
      name: 'Test Turbo GT',
      exterior_color: 'viper_green',
      wheels: 'track_slick',
      roof: 'carbon',
      interior: 'sport_carbon',
      powertrain: 'v8_50',
      accessories: 'spoiler'
    }

    const res = await fetch(`${baseUrl}/api/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar)
    })

    assert.strictEqual(res.status, 201)
    const created = await res.json()
    assert.strictEqual(created.name, 'Test Turbo GT')
    assert.ok(created.total_price > 30000)
  })

  await t.test('POST /api/cars rejects impossible combination with 400 Bad Request', async () => {
    const invalidCar = {
      name: 'Impossible Roadster',
      exterior_color: 'flame_red',
      wheels: 'sport_18',
      roof: 'convertible',
      interior: 'leather_black',
      powertrain: 'turbo_20',
      accessories: 'roof_rack'
    }

    const res = await fetch(`${baseUrl}/api/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidCar)
    })

    assert.strictEqual(res.status, 400)
    const errData = await res.json()
    assert.ok(errData.error.includes('Convertible Soft Top cannot be combined with Roof Cargo Rack'))
  })

  await t.test('DELETE /api/cars/:id removes custom car', async () => {
    const deleteRes = await fetch(`${baseUrl}/api/cars/1`, {
      method: 'DELETE'
    })

    assert.strictEqual(deleteRes.status, 200)
    const data = await deleteRes.json()
    assert.strictEqual(data.id, 1)

    const getRes = await fetch(`${baseUrl}/api/cars/1`)
    assert.strictEqual(getRes.status, 404)
  })
})
