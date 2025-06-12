import React from 'react'

function CalendarView({ events, currentDate, onEventClick }) {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  
  // Get calendar dates
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const calendarDays = []
  const currentDateObj = new Date(startDate)
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(currentDateObj)
    const isCurrentMonth = cellDate.getMonth() === month
    const isToday = cellDate.toDateString() === new Date().toDateString()
    
    // Find events for this day
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === cellDate.toDateString()
    })
    
    calendarDays.push({
      date: cellDate,
      isCurrentMonth,
      isToday,
      events: dayEvents
    })
    
    currentDateObj.setDate(currentDateObj.getDate() + 1)
  }

  return (
    <div className="calendar-view">
      {/* Calendar headers */}
      {weekdays.map(day => (
        <div key={day} className="calendar-header">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {calendarDays.map((day, index) => (
        <div 
          key={index} 
          className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
        >
          <div className="day-number">
            {day.date.getDate()}
          </div>
          
          {day.events.length > 0 && (
            <div className="calendar-events">
              {/* Show up to 3 events directly */}
              {day.events.slice(0, 3).map(event => (
                <div 
                  key={event.id}
                  className={`calendar-event ${event.status === 'NEW!' ? 'new' : ''}`}
                  title={event.title}
                  onClick={() => onEventClick(event)}
                >
                  {event.time} {event.title}
                </div>
              ))}
              
              {/* Show count if more than 3 events */}
              {day.events.length > 3 && (
                <div 
                  className="event-count"
                  onClick={() => {
                    // Could show a modal with all events for this day
                    console.log('Show all events for', day.date, day.events)
                  }}
                >
                  +{day.events.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CalendarView