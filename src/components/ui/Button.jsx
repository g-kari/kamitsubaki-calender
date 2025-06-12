import React from 'react'

function Button({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false 
}) {
  const baseClass = 'ui-button'
  const variantClass = `ui-button-${variant}`
  const sizeClass = size === 'icon' ? 'ui-button-icon' : ''
  
  const classes = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim()
  
  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button