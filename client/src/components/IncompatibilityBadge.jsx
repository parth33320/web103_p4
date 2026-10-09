import React from 'react'
import { AlertTriangle, ShieldAlert } from 'lucide-react'

export const IncompatibilityBadge = ({ errorMessage }) => {
  if (!errorMessage) return null

  return (
    <div className="incompatibility-badge" role="alert">
      <ShieldAlert className="alert-icon" size={24} />
      <div className="alert-body">
        <strong className="alert-title">Impossible Combination Warning</strong>
        <p className="alert-text">{errorMessage}</p>
      </div>
    </div>
  )
}
