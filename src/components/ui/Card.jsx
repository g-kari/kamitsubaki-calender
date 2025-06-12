import React from 'react'

function Card({ children, className = '' }) {
  return (
    <div className={`ui-card ${className}`}>
      {children}
    </div>
  )
}

function CardContent({ children, className = '' }) {
  return (
    <div className={`ui-card-content ${className}`}>
      {children}
    </div>
  )
}

export { Card, CardContent }