import React from 'react'

function EventModal({ event, onClose }) {
  if (!event) return null

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const createCalendarLink = () => {
    const startDate = new Date(`${event.date}T${event.time}:00+09:00`)
    const endDate = new Date(`${event.date}T${event.endTime || event.time}:00+09:00`)
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    // Google Calendar
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(event.description + '\n出演: ' + event.performers)}&location=${encodeURIComponent(event.venue + ', ' + event.address)}`
    
    return googleUrl
  }

  return (
    <div className="event-modal show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="event-title">{event.title}</h2>
        
        {event.status && (
          <div className={`day-badge ${event.status === 'NEW!' ? 'new' : 'updated'}`}>
            {event.status}
          </div>
        )}
        
        <div className="event-details">
          <div className="event-detail">
            <strong>📅 日時:</strong> {formatDate(event.date)} {event.time}
            {event.endTime && event.endTime !== event.time && ` - ${event.endTime}`}
          </div>
          <div className="event-detail">
            <strong>📍 会場:</strong> <span className="venue">{event.venue}</span>
          </div>
          {event.address && (
            <div className="event-detail">
              <strong>🗺️ 住所:</strong> {event.address}
            </div>
          )}
          <div className="event-detail">
            <strong>🎭 出演:</strong> {event.performers}
          </div>
          {event.ticketInfo && (
            <div className="event-detail">
              <strong>🎫 チケット:</strong> {event.ticketInfo}
            </div>
          )}
          {event.description && (
            <div className="event-detail">
              <strong>📝 詳細:</strong> {event.description}
            </div>
          )}
        </div>

        {event.access && (
          <div className="performers">
            <strong>🚇 アクセス情報</strong>
            <div style={{ marginTop: '5px' }}>
              <div>最寄駅: {event.access.station}</div>
              <div>徒歩時間: {event.access.walkTime}</div>
              {event.access.notes && <div>備考: {event.access.notes}</div>}
            </div>
          </div>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="event-tags">
            {event.tags.map((tag, index) => (
              <span key={index} className="event-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="export-section" style={{ marginTop: '20px' }}>
          <h4>📅 カレンダーに追加</h4>
          <div className="export-buttons">
            <a 
              href={createCalendarLink()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="export-btn"
            >
              📅 Googleカレンダーに追加
            </a>
            {event.url && (
              <a 
                href={event.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="export-btn"
              >
                🔗 公式サイトを見る
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModal