import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOptionsCatalog } from '../services/optionsAPI'
import { createCar } from '../services/carsAPI'
import { CarVisualRenderer } from '../components/CarVisualRenderer'
import { PriceBreakdown } from '../components/PriceBreakdown'
import { IncompatibilityBadge } from '../components/IncompatibilityBadge'
import { checkIncompatibility } from '../utilities/validation'
import { Sparkles, Save, Info, AlertCircle } from 'lucide-react'

export const CreateCarPage = () => {
  const navigate = useNavigate()
  const [optionsCatalog, setOptionsCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [carName, setCarName] = useState('My Custom GT')
  const [submitError, setSubmitError] = useState(null)

  const [selectedOptions, setSelectedOptions] = useState({
    exteriorColor: 'flame_red',
    wheels: 'sport_18',
    roof: 'hardtop',
    interior: 'leather_black',
    powertrain: 'turbo_20',
    accessories: 'none'
  })

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await getOptionsCatalog()
        setOptionsCatalog(data)
      } catch (err) {
        console.error('Failed to load options catalog', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCatalog()
  }, [])

  const { isValid, error: validationError, disabledOptionIds } = checkIncompatibility(selectedOptions)

  const handleOptionChange = (categoryKey, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [categoryKey]: optionId
    }))
    setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!carName.trim()) {
      setSubmitError('Please enter a name for your custom vehicle build.')
      return
    }

    if (!isValid) {
      setSubmitError(validationError)
      return
    }

    setSaving(true)
    setSubmitError(null)

    try {
      const carPayload = {
        name: carName.trim(),
        exterior_color: selectedOptions.exteriorColor,
        wheels: selectedOptions.wheels,
        roof: selectedOptions.roof,
        interior: selectedOptions.interior,
        powertrain: selectedOptions.powertrain,
        accessories: selectedOptions.accessories
      }

      await createCar(carPayload)
      navigate('/cars')
    } catch (err) {
      setSubmitError(err.message || 'Error saving custom vehicle build.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
        <p>Loading Personalizer Studio options...</p>
      </div>
    )
  }

  return (
    <div className="create-car-page">
      <div className="page-header">
        <div className="page-header-text">
          <h2>Vehicle Personalizer Studio</h2>
          <p>Customize every feature in real-time, inspect live pricing, and save your custom build.</p>
        </div>
      </div>

      <div className="personalizer-grid">
        {/* Left Column: Interactive Visual Preview & Price Breakdown */}
        <div className="preview-column">
          <div className="visual-card">
            <CarVisualRenderer
              selectedOptions={selectedOptions}
              optionsCatalog={optionsCatalog}
            />
          </div>

          <PriceBreakdown
            selectedOptions={selectedOptions}
            optionsCatalog={optionsCatalog}
          />
        </div>

        {/* Right Column: Personalizer Controls Form */}
        <div className="controls-column">
          <form onSubmit={handleSubmit} className="personalizer-form">
            <div className="form-group name-group">
              <label htmlFor="carName" className="form-label">
                Custom Build Name
              </label>
              <input
                id="carName"
                type="text"
                className="text-input"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="e.g. Midnight Speedster GT"
                maxLength={50}
                required
              />
            </div>

            <IncompatibilityBadge errorMessage={validationError} />

            {submitError && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Feature Selectors */}
            {optionsCatalog?.categories &&
              Object.entries(optionsCatalog.categories).map(([categoryKey, optionsList]) => (
                <div key={categoryKey} className="feature-category-card">
                  <h4 className="category-header">{formatCategoryTitle(categoryKey)}</h4>
                  <div className="options-options-grid">
                    {optionsList.map((option) => {
                      const isSelected = selectedOptions[categoryKey] === option.id
                      const isDisabled = disabledOptionIds.has(option.id)

                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={`option-btn ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                          disabled={isDisabled}
                          onClick={() => handleOptionChange(categoryKey, option.id)}
                          title={isDisabled ? 'Incompatible option choice disabled' : ''}
                        >
                          <div className="option-btn-top">
                            {categoryKey === 'exteriorColor' && (
                              <span
                                className="color-swatch"
                                style={{ backgroundColor: option.visualValue }}
                              />
                            )}
                            <span className="option-btn-name">{option.name}</span>
                          </div>
                          <span className="option-btn-price">
                            {option.price > 0 ? `+$${option.price.toLocaleString()}` : 'Free'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

            <button
              type="submit"
              className="save-build-btn"
              disabled={saving || !isValid}
            >
              <Save size={20} />
              <span>{saving ? 'Saving Custom Vehicle...' : 'Save Custom Build'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const formatCategoryTitle = (key) => {
  switch (key) {
    case 'exteriorColor':
      return '1. Exterior Paint Color'
    case 'wheels':
      return '2. Wheels & Tire Package'
    case 'roof':
      return '3. Roof Styling & Material'
    case 'interior':
      return '4. Interior Upholstery & Trim'
    case 'powertrain':
      return '5. Powertrain Engine'
    case 'accessories':
      return '6. Exterior Accessories & Aero'
    default:
      return key
  }
}
