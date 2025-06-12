import React from 'react'
import EventCard from './EventCard'
import CalendarView from './CalendarView'

function EventsDisplay({ events, viewMode, currentCalendarDate, onEventClick }) {
  if (events.length === 0) {
    return (
      <div className="events-grid">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          フィルター条件に一致するイベントがありません。
        </div>
      </div>
    )
  }

  if (viewMode === 'calendar') {
    return (
      <CalendarView 
        events={events} 
        currentDate={currentCalendarDate}
        onEventClick={onEventClick}
      />
    )
  }

  return (
    <div className="events-grid">
      {events.map(event => (
        <EventCard 
          key={event.id} 
          event={event} 
          onClick={() => onEventClick(event)}
        />
      ))}
    </div>
  )
}

export default EventsDisplay