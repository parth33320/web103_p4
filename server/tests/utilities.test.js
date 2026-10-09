import test from 'node:test'
import assert from 'node:assert'
import { calculateItemizedPrice } from '../../client/src/utilities/calcPrice.js'
import { checkIncompatibility } from '../../client/src/utilities/validation.js'
import { OPTIONS_CATALOG, BASE_PRICE } from '../config/optionsCatalog.js'

test('calcPrice: calculates correct total price and itemized list', () => {
  const selectedOptions = {
    exteriorColor: 'flame_red', // 500
    wheels: 'turbines_20',     // 1500
    roof: 'panoramic',         // 1500
    interior: 'suede_tan',      // 1400
    powertrain: 'v8_50',       // 4500
    accessories: 'spoiler'      // 700
  }

  const result = calculateItemizedPrice(selectedOptions, OPTIONS_CATALOG, BASE_PRICE)

  assert.strictEqual(result.basePrice, 30000)
  assert.strictEqual(result.itemizedList.length, 6)
  // Expected sum: 30000 + 500 + 1500 + 1500 + 1400 + 4500 + 700 = 40100
  assert.strictEqual(result.total, 40100)
})

test('validation: detects impossible convertible + roof rack combination', () => {
  const selectedOptions = {
    exteriorColor: 'flame_red',
    wheels: 'sport_18',
    roof: 'convertible',
    interior: 'leather_black',
    powertrain: 'turbo_20',
    accessories: 'roof_rack'
  }

  const result = checkIncompatibility(selectedOptions)

  assert.strictEqual(result.isValid, false)
  assert.ok(result.error.includes('Convertible Soft Top'))
  assert.ok(result.disabledOptionIds.has('roof_rack'))
})

test('validation: detects impossible electric powertrain + exhaust combination', () => {
  const selectedOptions = {
    exteriorColor: 'flame_red',
    wheels: 'sport_18',
    roof: 'hardtop',
    interior: 'leather_black',
    powertrain: 'electric',
    accessories: 'exhaust'
  }

  const result = checkIncompatibility(selectedOptions)

  assert.strictEqual(result.isValid, false)
  assert.ok(result.error.includes('Eco Dual-Electric Motor'))
  assert.ok(result.disabledOptionIds.has('exhaust'))
})

test('validation: allows valid combination', () => {
  const selectedOptions = {
    exteriorColor: 'electric_blue',
    wheels: 'sport_18',
    roof: 'hardtop',
    interior: 'leather_black',
    powertrain: 'electric',
    accessories: 'spoiler'
  }

  const result = checkIncompatibility(selectedOptions)

  assert.strictEqual(result.isValid, true)
  assert.strictEqual(result.error, null)
})
