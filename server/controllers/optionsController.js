import { OPTIONS_CATALOG, BASE_PRICE, IMPOSSIBLE_COMBOS } from '../config/optionsCatalog.js'

export const getOptionsCatalog = (req, res) => {
  try {
    return res.status(200).json({
      basePrice: BASE_PRICE,
      categories: OPTIONS_CATALOG,
      impossibleCombos: IMPOSSIBLE_COMBOS
    })
  } catch (error) {
    console.error('Error fetching options catalog:', error)
    return res.status(500).json({ error: 'Failed to retrieve options catalog' })
  }
}
