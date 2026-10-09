import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCars, deleteCar } from '../services/carsAPI'
import { Car, Eye, Edit3, Trash2, PlusCircle, Calendar, DollarSign, Tag } from 'lucide-react'

export const CarsListPage = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchCars = async () => {
    try {
      setLoading(true)
      const data = await getAllCars()
      setCars(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load custom builds.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this custom vehicle build?')) {
      return
    }

    try {
      setDeletingId(id)
      await deleteCar(id)
      setCars((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(err.message || 'Failed to delete car.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
        <p>Loading saved custom vehicle builds...</p>
      </div>
    )
  }

  return (
    <div className="cars-list-page">
      <div className="page-header">
        <div>
          <h2>Saved Custom Vehicles</h2>
          <p>View, edit, or delete your customized vehicle builds in the gallery below.</p>
        </div>
        <Link to="/" className="create-new-link-btn">
          <PlusCircle size={20} />
          <span>Personalize New Build</span>
        </Link>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {cars.length === 0 ? (
        <div className="empty-state">
          <Car size={64} className="empty-icon" />
          <h3>No Custom Vehicle Builds Saved Yet</h3>
          <p>Customize your first vehicle personalizer build to see it displayed here.</p>
          <Link to="/" className="btn-primary">
            Create First Build
          </Link>
        </div>
      ) : (
        <div className="cars-cards-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-summary-card">
              <div className="card-top-bar">
                <span className="car-badge-mini">Build #{car.id}</span>
                <span className="car-price-tag">
                  ${parseFloat(car.total_price || 0).toLocaleString()}
                </span>
              </div>

              <h3 className="car-card-name">{car.name}</h3>

              <div className="car-card-features">
                <div className="feature-pill">
                  <Tag size={14} />
                  <span>Paint: {formatOptionName(car.exterior_color)}</span>
                </div>
                <div className="feature-pill">
                  <Tag size={14} />
                  <span>Wheels: {formatOptionName(car.wheels)}</span>
                </div>
                <div className="feature-pill">
                  <Tag size={14} />
                  <span>Roof: {formatOptionName(car.roof)}</span>
                </div>
                <div className="feature-pill">
                  <Tag size={14} />
                  <span>Powertrain: {formatOptionName(car.powertrain)}</span>
                </div>
              </div>

              <div className="card-actions">
                <Link to={`/cars/${car.id}`} className="card-action-btn view-btn">
                  <Eye size={16} />
                  <span>Details</span>
                </Link>

                <Link to={`/cars/${car.id}/edit`} className="card-action-btn edit-btn">
                  <Edit3 size={16} />
                  <span>Edit</span>
                </Link>

                <button
                  type="button"
                  onClick={(e) => handleDelete(car.id, e)}
                  disabled={deletingId === car.id}
                  className="card-action-btn delete-btn"
                >
                  <Trash2 size={16} />
                  <span>{deletingId === car.id ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const formatOptionName = (str) => {
  if (!str) return 'Standard'
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
