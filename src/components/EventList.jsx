import React from 'react'
import { Card, CardContent } from './ui/Card'
import Badge from './ui/Badge'

function EventList({ events, onEventClick }) {
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "event":
      case "fanmeeting":
      case "talk":
        return "pink"
      case "live":
        return "blue"
      case "movie":
        return "purple"
      default:
        return "secondary"
    }
  }

  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return { month, day }
  }

  const formatDateRange = (startDate, endDate) => {
    if (!endDate || startDate === endDate) {
      const { month, day } = formatEventDate(startDate)
      return `${day}.${month}`
    }
    
    const start = formatEventDate(startDate)
    const end = formatEventDate(endDate)
    return `${start.day}.${start.month} - ${end.day}.${end.month}`
  }

  return (
    <div className="v0-event-list">
      <div className="v0-event-list-header">
        <h2 className="v0-event-list-title">EVENT INFORMATION</h2>
        <p className="v0-event-list-subtitle">
          KAMITSUBAKI CITY UNDER CONSTRUCTION & VIRTUAL WITCH PHENOMENON EVENT INFORMATION
        </p>
      </div>

      <div className="v0-event-grid">
        {events.map((event) => {
          const { month, day } = formatEventDate(event.date)
          
          return (
            <div
              key={event.id}
              className="v0-event-card"
              onClick={() => onEventClick && onEventClick(event)}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="v0-event-card-content">
                  <div className="v0-event-date-section">
                    <div className="v0-event-year">2025</div>
                    <div className="v0-event-date">
                      {day}.{month}
                    </div>
                    {event.endDate && event.endDate !== event.date && (
                      <>
                        <div className="v0-event-separator">↓</div>
                        <div className="v0-event-date">
                          {formatEventDate(event.endDate).day}.{formatEventDate(event.endDate).month}
                        </div>
                      </>
                    )}
                    <div className="v0-event-studio">
                      KAMITSUBAKI STUDIO
                    </div>
                  </div>
                  <div className="v0-event-info-section">
                    <div className="v0-event-header">
                      <Badge variant={getCategoryColor(event.category)}>
                        {event.category?.toUpperCase() || 'EVENT'}
                      </Badge>
                    </div>
                    <h3 className="v0-event-title">{event.title}</h3>
                    <div className="v0-event-image-placeholder">
                      イベント画像
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EventList