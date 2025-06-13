import React, { useState } from 'react'
import Button from './ui/Button'
import { Card, CardContent } from './ui/Card'
import Badge from './ui/Badge'

// ChevronLeft and ChevronRight icons as simple components
function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  )
}

function Calendar({ events, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  const dayNames = ["月", "火", "水", "木", "金", "土", "日"]

  const getEventsForDate = (date) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`
    return events.filter((event) => event.date === dateString)
  }

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "event":
      case "fanmeeting":
      case "talk":
        return "bg-gray-300"
      case "live":
        return "bg-gray-400"
      case "movie":
        return "bg-gray-500"
      default:
        return "bg-gray-200"
    }
  }

  const getCategoryBadgeVariant = (category) => {
    switch (category?.toLowerCase()) {
      case "event":
      case "fanmeeting":
      case "talk":
        return "secondary"
      case "live":
        return "secondary"
      case "movie":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="v0-calendar">
      <div className="v0-calendar-header">
        <div className="v0-calendar-title-section">
          <h2 className="v0-calendar-main-title">CALENDAR</h2>
          <div className="v0-calendar-date-section">
            <div className="v0-calendar-year">{currentDate.getFullYear()}</div>
            <div className="v0-calendar-month">{monthNames[currentDate.getMonth()]}</div>
          </div>
        </div>
        <div className="v0-calendar-nav">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="v0-calendar-grid">
            {dayNames.map((day) => (
              <div key={day} className="v0-calendar-day-header">
                {day}
              </div>
            ))}
            
            {Array.from({ length: (firstDayOfMonth + 6) % 7 }, (_, i) => (
              <div key={`empty-${i}`} className="v0-calendar-day-cell"></div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = i + 1
              const dayEvents = getEventsForDate(date)

              return (
                <div key={date} className="v0-calendar-day-cell">
                  <div className="v0-calendar-day-number">{String(date).padStart(2, "0")}</div>
                  <div className="v0-calendar-day-events">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`v0-calendar-event ${getCategoryColor(event.category)}`}
                        title={event.title}
                        onClick={() => onEventClick && onEventClick(event)}
                        style={{
                          background: getCategoryColor(event.category).includes('gray-300') ? '#f3f4f6' : 
                                     getCategoryColor(event.category).includes('gray-400') ? '#e5e7eb' : 
                                     getCategoryColor(event.category).includes('gray-500') ? '#d1d5db' : '#f9fafb',
                          color: getCategoryColor(event.category).includes('gray-300') ? '#374151' : 
                                getCategoryColor(event.category).includes('gray-400') ? '#1f2937' : 
                                getCategoryColor(event.category).includes('gray-500') ? '#111827' : '#6b7280'
                        }}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="v0-info-cards">
        <Card>
          <CardContent>
            <h3 className="v0-info-card-header">
              <span className="v0-info-card-icon" style={{background: '#6b7280'}}></span>
              <span className="v0-info-card-title">EVENT</span>
            </h3>
            <div className="v0-info-card-content">
              {events
                .filter(event => event.category?.toLowerCase() === 'event' || event.category?.toLowerCase() === 'fanmeeting' || event.category?.toLowerCase() === 'talk')
                .slice(0, 4)
                .map(event => (
                  <div key={event.id}>
                    {event.date} {event.title}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="v0-info-card-header">
              <span className="v0-info-card-icon" style={{background: '#374151'}}></span>
              <span className="v0-info-card-title">LIVE</span>
            </h3>
            <div className="v0-info-card-content">
              {events
                .filter(event => event.category?.toLowerCase() === 'live')
                .slice(0, 4)
                .map(event => (
                  <div key={event.id}>
                    {event.date} {event.title}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="v0-info-card-header">
              <span className="v0-info-card-icon" style={{background: '#1f2937'}}></span>
              <span className="v0-info-card-title">MOVIE</span>
            </h3>
            <div className="v0-info-card-content">
              {events
                .filter(event => event.category?.toLowerCase() === 'movie')
                .slice(0, 4)
                .map(event => (
                  <div key={event.id}>
                    {event.date} {event.title}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Calendar