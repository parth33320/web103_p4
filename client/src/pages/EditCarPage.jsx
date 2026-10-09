import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCarById, updateCar } from '../services/carsAPI'
import { getOptionsCatalog } from '../services/optionsAPI'
import { CarVisualRenderer } from '../components/CarVisualRenderer'
import { PriceBreakdown } from '../components/PriceBreakdown'
import { IncompatibilityBadge } from '../components/IncompatibilityBadge'
import { checkIncompatibility } from '../utilities/validation'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'

export const EditCarPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [optionsCatalog, setOptionsCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [carName, setCarName] = useState('')
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
    const fetchData = async () => {
      try {
        const [carData, catalogData] = await Promise.all([
          getCarById(id),
          getOptionsCatalog()
        ])

        setOptionsCatalog(catalogData)
        setCarName(carData.name)
        setSelectedOptions({
          exteriorColor: carData.exterior_color,
          wheels: carData.wheels,
          roof: carData.roof,
          interior: carData.interior,
          powertrain: carData.powertrain,
          accessories: carData.accessories || 'none'
        })
      } catch (err) {
        console.error(err)
        setSubmitError('Failed to load custom car build for editing.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

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

      await updateCar(id, carPayload)
      navigate(`/cars/${id}`)
    } catch (err) {
      setSubmitError(err.message || 'Error updating custom vehicle build.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
        <p>Loading vehicle build editor...</p>
      </div>
    )
  }

  return (
    <div className="edit-car-page">
      <div className="detail-top-bar">
        <Link to={`/cars/${id}`} className="back-link">
          <ArrowLeft size={20} />
          <span>Cancel & Back to Vehicle Details</span>
        </Link>
      </div>

      <div className="page-header">
        <div className="page-header-text">
          <h2>Edit Custom Build #{id}</h2>
          <p>Modify options, inspect visual state changes, and update your saved vehicle.</p>
        </div>
      </div>

      <div className="personalizer-grid">
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
              <span>{saving ? 'Updating Build...' : 'Save Updated Build'}</span>
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
