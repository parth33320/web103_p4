import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Car, PlusCircle, List, Sparkles } from 'lucide-react'

export const Navbar = () => {
  const location = useLocation()

  return (
    <header className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <Car className="brand-icon" size={32} />
          <div className="brand-text">
            <span className="brand-title">DIY Auto Crafter</span>
            <span className="brand-subtitle">Vehicle Personalizer Studio</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <PlusCircle size={20} />
            <span>Customize New Build</span>
          </Link>

          <Link
            to="/cars"
            className={`nav-item ${location.pathname === '/cars' ? 'active' : ''}`}
          >
            <List size={20} />
            <span>View Saved Cars</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
