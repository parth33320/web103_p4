import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCarById, deleteCar } from '../services/carsAPI'
import { getOptionsCatalog } from '../services/optionsAPI'
import { CarVisualRenderer } from '../components/CarVisualRenderer'
import { PriceBreakdown } from '../components/PriceBreakdown'
import { ArrowLeft, Edit3, Trash2, Calendar, Check, DollarSign } from 'lucide-react'

export const CarDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [optionsCatalog, setOptionsCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carData, catalogData] = await Promise.all([
          getCarById(id),
          getOptionsCatalog()
        ])
        setCar(carData)
        setOptionsCatalog(catalogData)
      } catch (err) {
        console.error(err)
        setError('Failed to load custom car details.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${car?.name}"?`)) {
      return
    }

    try {
      setDeleting(true)
      await deleteCar(id)
      navigate('/cars')
    } catch (err) {
      alert(err.message || 'Failed to delete custom car.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
        <p>Loading vehicle build details...</p>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="error-container">
        <h3>Vehicle Build Not Found</h3>
        <p>{error || 'The requested custom vehicle build could not be located.'}</p>
        <Link to="/cars" className="btn-primary">
          Back to Saved Vehicles
        </Link>
      </div>
    )
  }

  const selectedOptionsState = {
    exteriorColor: car.exterior_color,
    wheels: car.wheels,
    roof: car.roof,
    interior: car.interior,
    powertrain: car.powertrain,
    accessories: car.accessories
  }

  return (
    <div className="car-detail-page">
      <div className="detail-top-bar">
        <Link to="/cars" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to All Saved Cars</span>
        </Link>

        <div className="detail-header-actions">
          <Link to={`/cars/${id}/edit`} className="action-btn edit-action-btn">
            <Edit3 size={18} />
            <span>Edit Build</span>
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="action-btn delete-action-btn"
          >
            <Trash2 size={18} />
            <span>{deleting ? 'Deleting...' : 'Delete Build'}</span>
          </button>
        </div>
      </div>

      <div className="detail-main-grid">
        <div className="detail-visual-col">
          <div className="detail-title-card">
            <h2>{car.name}</h2>
            <span className="detail-created-date">
              <Calendar size={16} /> Created:{' '}
              {car.created_at ? new Date(car.created_at).toLocaleDateString() : 'Recently'}
            </span>
          </div>

          <div className="visual-card">
            <CarVisualRenderer
              selectedOptions={selectedOptionsState}
              optionsCatalog={optionsCatalog}
            />
          </div>
        </div>

        <div className="detail-specs-col">
          <PriceBreakdown
            selectedOptions={selectedOptionsState}
            optionsCatalog={optionsCatalog}
          />

          <div className="specs-card">
            <h3>Build Specifications Summary</h3>

            <div className="spec-item">
              <span className="spec-label">Exterior Paint Color:</span>
              <span className="spec-value">{formatOption(car.exterior_color)}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Wheels & Tires:</span>
              <span className="spec-value">{formatOption(car.wheels)}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Roof Configuration:</span>
              <span className="spec-value">{formatOption(car.roof)}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Interior Trim:</span>
              <span className="spec-value">{formatOption(car.interior)}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Powertrain:</span>
              <span className="spec-value">{formatOption(car.powertrain)}</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">Accessories:</span>
              <span className="spec-value">{formatOption(car.accessories)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const formatOption = (val) => {
  if (!val) return 'Standard'
  return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
