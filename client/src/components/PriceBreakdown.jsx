import React from 'react'
import { calculateItemizedPrice } from '../utilities/calcPrice'
import { DollarSign, Tag, CheckCircle } from 'lucide-react'

export const PriceBreakdown = ({ selectedOptions, optionsCatalog }) => {
  const { basePrice, itemizedList, total } = calculateItemizedPrice(
    selectedOptions,
    optionsCatalog?.categories,
    optionsCatalog?.basePrice || 30000
  )

  return (
    <div className="price-breakdown-card">
      <div className="price-header">
        <DollarSign className="price-icon" size={24} />
        <h3 className="price-title">Itemized Price Breakdown</h3>
      </div>

      <div className="price-list">
        <div className="price-row base-row">
          <span className="price-label">
            <CheckCircle size={16} className="item-icon" /> Base Vehicle MSRP
          </span>
          <span className="price-amount">${basePrice.toLocaleString()}</span>
        </div>

        {itemizedList.map((item) => (
          <div key={item.categoryKey} className="price-row option-row">
            <div className="price-option-info">
              <Tag size={14} className="tag-icon" />
              <span className="category-tag">{item.categoryName}:</span>
              <span className="option-name">{item.optionName}</span>
            </div>
            <span className="price-amount">
              {item.price > 0 ? `+$${item.price.toLocaleString()}` : 'Included'}
            </span>
          </div>
        ))}

        <div className="price-divider" />

        <div className="price-row total-row">
          <span className="total-label">Total Custom Build Price</span>
          <span className="total-amount">${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
