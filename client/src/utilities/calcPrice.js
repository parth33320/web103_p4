export const DEFAULT_BASE_PRICE = 30000

export const calculateItemizedPrice = (selectedOptions, catalogCategories, basePrice = DEFAULT_BASE_PRICE) => {
  if (!catalogCategories) {
    return { basePrice, itemizedList: [], total: basePrice }
  }

  const itemizedList = []
  let total = basePrice

  for (const [categoryKey, selectedOptionId] of Object.entries(selectedOptions)) {
    const categoryOptions = catalogCategories[categoryKey]
    if (categoryOptions && Array.isArray(categoryOptions)) {
      const optionMatch = categoryOptions.find((opt) => opt.id === selectedOptionId)
      if (optionMatch) {
        itemizedList.push({
          categoryKey,
          categoryName: formatCategoryName(categoryKey),
          optionName: optionMatch.name,
          price: optionMatch.price
        })
        total += optionMatch.price
      }
    }
  }

  return {
    basePrice,
    itemizedList,
    total
  }
}

export const formatCategoryName = (key) => {
  switch (key) {
    case 'exteriorColor':
      return 'Exterior Paint'
    case 'wheels':
      return 'Wheels & Tires'
    case 'roof':
      return 'Roof Type'
    case 'interior':
      return 'Interior Trim'
    case 'powertrain':
      return 'Powertrain Engine'
    case 'accessories':
      return 'Accessories'
    default:
      return key.charAt(0).toUpperCase() + key.slice(1)
  }
}
