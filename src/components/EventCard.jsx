import React from 'react'

function EventCard({ event, onClick }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const getDaysUntilEvent = () => {
    const today = new Date()
    const eventDate = new Date(event.date)
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return null
    if (diffDays === 0) return '今日'
    if (diffDays === 1) return '明日'
    return `あと${diffDays}日`
  }

  const daysUntil = getDaysUntilEvent()

  return (
    <div className={`event-card ${event.status === 'NEW!' ? 'new' : ''}`}>
      {event.status && (
        <div className={`day-badge ${event.status === 'NEW!' ? 'new' : 'updated'}`}>
          {event.status}
        </div>
      )}
      
      {daysUntil && (
        <div className="countdown-timer">
          📅 {daysUntil}
        </div>
      )}
      
      <h3 className="event-title">{event.title}</h3>
      
      <div className="event-details">
        <div className="event-detail">
          <strong>📅 日時:</strong> {formatDate(event.date)} {event.time}
        </div>
        <div className="event-detail">
          <strong>📍 会場:</strong> <span className="venue">{event.venue}</span>
        </div>
        <div className="event-detail">
          <strong>🎭 出演:</strong> {event.performers}
        </div>
        {event.ticketInfo && (
          <div className="event-detail">
            <strong>🎫 チケット:</strong> {event.ticketInfo}
          </div>
        )}
      </div>

      {event.tags && event.tags.length > 0 && (
        <div className="event-tags">
          {event.tags.map((tag, index) => (
            <span key={index} className="event-tag">{tag}</span>
          ))}
        </div>
      )}

      <button className="register-btn" onClick={onClick}>
        📝 詳細を見る
      </button>
    </div>
  )
}

export default EventCard