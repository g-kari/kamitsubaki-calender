import React, { useEffect, useState } from 'react'

function NotificationBadge({ message }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (message) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (!message) return null

  return (
    <div className={`notification-badge ${show ? 'show' : ''}`}>
      {message}
    </div>
  )
}

export default NotificationBadge