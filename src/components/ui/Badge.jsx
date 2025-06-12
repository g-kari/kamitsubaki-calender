import React from 'react'

function Badge({ children, variant = 'secondary', className = '' }) {
  const variantClasses = {
    secondary: 'ui-badge-secondary',
    pink: 'ui-badge-pink',
    blue: 'ui-badge-blue', 
    purple: 'ui-badge-purple'
  }
  
  return (
    <span className={`ui-badge ${variantClasses[variant] || variantClasses.secondary} ${className}`}>
      {children}
    </span>
  )
}

export default Badge