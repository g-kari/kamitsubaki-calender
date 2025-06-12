import { useState, useEffect, useCallback } from 'react'
import './App.css'

function App() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false)
  const [currentViewMode, setCurrentViewMode] = useState('list')
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtist, setSelectedArtist] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Fetch events from data file
  const fetchKamitsubakiEvents = useCallback(async () => {
    try {
      const response = await fetch('./data/events.json')
      const data = await response.json()
      return data.events || []
    } catch (error) {
      console.error('Failed to fetch events:', error)
      return []
    }
  }, [])

  // Auto-generate tags for events
  const autoGenerateTags = useCallback((event) => {
    const tags = []
    
    // Title-based tags
    if (event.title.includes('MR') || event.title.includes('体験')) tags.push('体験会')
    if (event.title.includes('WARS') || event.title.includes('ライブ')) tags.push('ライブ')
    if (event.title.includes('ファンミ')) tags.push('ファンミ')
    if (event.title.includes('トーク')) tags.push('トーク')
    if (event.title.includes('配信')) tags.push('配信')
    
    // Location tags
    if (event.venue.includes('東京') || event.venue.includes('TOKYO') || event.venue.includes('渋谷') || event.venue.includes('後楽園')) tags.push('東京')
    if (event.venue.includes('大阪') || event.venue.includes('OSAKA')) tags.push('大阪')
    if (event.venue.includes('横浜')) tags.push('横浜')
    if (event.venue.includes('TBA') || event.venue.includes('未定')) tags.push('会場未定')
    if (event.venue.includes('オンライン') || event.venue.includes('配信')) tags.push('オンライン')
    
    // Artist tags
    const artists = ['花譜', '理芽', '春猿火', 'ヰ世界情緒', '幸祜', '明透', 'V.W.P']
    artists.forEach(artist => {
      if (event.performers.includes(artist) || event.title.includes(artist)) {
        tags.push(artist)
      }
    })
    
    return tags.length > 0 ? tags : ['イベント']
  }, [])

  // Update events
  const updateEvents = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      const updatedEvents = await fetchKamitsubakiEvents()
      
      // Mark new events
      const existingIds = events.map(e => e.id)
      const newEvents = updatedEvents.filter(event => !existingIds.includes(event.id))
      
      if (newEvents.length > 0) {
        newEvents.forEach(event => {
          event.status = 'NEW!'
          if (!event.tags) {
            event.tags = autoGenerateTags(event)
          }
        })
      }

      // Auto-generate tags for all events that don't have them
      updatedEvents.forEach(event => {
        if (!event.tags || event.tags.length === 0) {
          event.tags = autoGenerateTags(event)
        }
      })

      setEvents(updatedEvents)
      setLastUpdateTime(new Date())
      
      if (newEvents.length > 0) {
        setSuccessMessage(`${newEvents.length}件の新しいイベントが見つかりました！`)
        
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('KAMITSUBAKI 新イベント', {
              body: `${newEvents.length}件の新しいイベントが追加されました: ${newEvents[0].title}${newEvents.length > 1 ? ' など' : ''}`,
              icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23667eea"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="30">🌸</text></svg>'
            })
          } catch (e) {
            console.log('Failed to send notification')
          }
        }
      }
      
    } catch (error) {
      console.error('Update error:', error)
      setErrorMessage('イベント情報の更新に失敗しました。しばらくしてからもう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }, [events, fetchKamitsubakiEvents, autoGenerateTags])

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...events]
    
    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        
        switch (dateFilter) {
          case 'today':
            return eventDate.toDateString() === today.toDateString()
          case 'week':
            const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            return eventDate >= today && eventDate <= oneWeek
          case 'month':
            return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear()
          case 'upcoming':
            return eventDate >= today
          default:
            return true
        }
      })
    }
    
    // Artist filter
    if (selectedArtist !== 'all') {
      filtered = filtered.filter(event => 
        event.performers.includes(selectedArtist) || 
        event.title.includes(selectedArtist)
      )
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(event => {
        const dateMatch = event.date.includes(searchTerm)
        const artistMatch = event.performers.toLowerCase().includes(searchLower) ||
                           event.title.toLowerCase().includes(searchLower)
        const searchMatch = event.title.toLowerCase().includes(searchLower) ||
                           event.venue.toLowerCase().includes(searchLower) ||
                           (event.description && event.description.toLowerCase().includes(searchLower)) ||
                           (event.address && event.address.toLowerCase().includes(searchLower)) ||
                           (event.access && event.access.station && event.access.station.toLowerCase().includes(searchLower)) ||
                           (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        
        return dateMatch || artistMatch || searchMatch
      })
    }
    
    setFilteredEvents(filtered)
  }, [events, dateFilter, selectedArtist, searchTerm])

  // Show success message temporarily
  const showSuccessMessage = useCallback((message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 5000)
  }, [])

  // Show error message temporarily  
  const showError = useCallback((message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }, [])

  // Calculate stats
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
    thisMonthEvents: events.filter(e => {
      const eventDate = new Date(e.date)
      const now = new Date()
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
    }).length,
    newEvents: events.filter(e => e.status === 'NEW!').length
  }

  // Initialize and load events
  useEffect(() => {
    const initializeApp = async () => {
      const initialEvents = await fetchKamitsubakiEvents()
      
      // Auto-generate tags for events that don't have them
      initialEvents.forEach(event => {
        if (!event.tags || event.tags.length === 0) {
          event.tags = autoGenerateTags(event)
        }
      })
      
      setEvents(initialEvents)
      setFilteredEvents(initialEvents)
      
      // Auto-update after 1 second
      setTimeout(updateEvents, 1000)
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(e => console.log('Failed to get notification permission'))
      }
    }
    
    initializeApp()
  }, [fetchKamitsubakiEvents, autoGenerateTags, updateEvents])

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Auto-update interval
  useEffect(() => {
    let interval
    if (autoUpdateEnabled) {
      interval = setInterval(updateEvents, 30 * 60 * 1000) // 30 minutes
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoUpdateEnabled, updateEvents])

  // Show event modal
  const showEventModal = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  // Hide event modal
  const hideEventModal = () => {
    setShowModal(false)
    setSelectedEvent(null)
  }

  // Toggle auto-update
  const toggleAutoUpdate = () => {
    setAutoUpdateEnabled(!autoUpdateEnabled)
    if (!autoUpdateEnabled) {
      showSuccessMessage('自動更新が有効になりました（30分間隔）')
    } else {
      showSuccessMessage('自動更新が無効になりました')
    }
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>🌸 KAMITSUBAKI 自動更新カレンダー 🌸</h1>
        <p>神椿スタジオの最新イベント情報を自動で取得・更新します（GitHub Actions使用）</p>
      </div>

      {/* Update Info */}
      <div className="update-info">
        <div className="update-status">
          <span id="updateStatus">
            📡 {lastUpdateTime ? `最終更新: ${lastUpdateTime.toLocaleString('ja-JP')}` : '最終更新: 手動更新待ち'}
          </span>
          {isLoading && <div className="loading-spinner"></div>}
        </div>
        <div className="update-controls">
          <button className="update-btn" onClick={updateEvents} disabled={isLoading}>
            🔄 今すぐ更新
          </button>
          <div className="auto-update-toggle">
            <span>自動更新:</span>
            <div 
              className={`toggle-switch ${autoUpdateEnabled ? 'active' : ''}`} 
              onClick={toggleAutoUpdate}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className={`success-message ${successMessage ? 'show' : ''}`}>
          {successMessage}
        </div>
      )}

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{stats.totalEvents}</div>
          <div className="stat-label">総イベント数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.upcomingEvents}</div>
          <div className="stat-label">今後のイベント</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.thisMonthEvents}</div>
          <div className="stat-label">今月のイベント</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.newEvents}</div>
          <div className="stat-label">新着イベント</div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-controls">
          <div className="filter-group">
            <label>🔍 検索:</label>
            <input
              type="text"
              className="search-input"
              placeholder="イベント名、アーティスト、会場で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>🎭 アーティスト:</label>
            <select 
              className="filter-select"
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
            >
              <option value="all">すべて</option>
              <option value="花譜">花譜</option>
              <option value="理芽">理芽</option>
              <option value="春猿火">春猿火</option>
              <option value="ヰ世界情緒">ヰ世界情緒</option>
              <option value="幸祜">幸祜</option>
              <option value="明透">明透</option>
              <option value="V.W.P">V.W.P</option>
            </select>
          </div>
          <div className="filter-group">
            <label>📅 期間:</label>
            <select 
              className="filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">すべて</option>
              <option value="today">今日</option>
              <option value="week">今週</option>
              <option value="month">今月</option>
              <option value="upcoming">今後</option>
            </select>
          </div>
          <div className="filter-group">
            <label>📋 表示:</label>
            <select 
              className="filter-select"
              value={currentViewMode}
              onChange={(e) => setCurrentViewMode(e.target.value)}
            >
              <option value="list">リスト表示</option>
              <option value="calendar">カレンダー表示</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Display */}
      <EventsDisplay 
        events={filteredEvents}
        viewMode={currentViewMode}
        currentCalendarDate={currentCalendarDate}
        setCurrentCalendarDate={setCurrentCalendarDate}
        onEventClick={showEventModal}
      />

      {/* Event Modal */}
      {showModal && selectedEvent && (
        <EventModal 
          event={selectedEvent}
          onClose={hideEventModal}
        />
      )}
    </div>
  )
}

// Events Display Component
function EventsDisplay({ events, viewMode, currentCalendarDate, setCurrentCalendarDate, onEventClick }) {
  if (viewMode === 'calendar') {
    return (
      <CalendarView 
        events={events}
        currentDate={currentCalendarDate}
        setCurrentDate={setCurrentCalendarDate}
        onEventClick={onEventClick}
      />
    )
  }

  return <ListView events={events} onEventClick={onEventClick} />
}

// List View Component
function ListView({ events, onEventClick }) {
  return (
    <div className="events-grid">
      {events.map(event => (
        <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
      ))}
    </div>
  )
}

// Event Card Component
function EventCard({ event, onClick }) {
  const isNew = event.status === 'NEW!'
  
  return (
    <div className={`event-card ${isNew ? 'new' : ''}`} onClick={onClick}>
      {isNew && <div className="day-badge new">🎉 NEW!</div>}
      
      <div className="event-title">{event.title}</div>
      
      <div className="event-details">
        <div className="event-detail">
          <strong>📅 日時:</strong> {event.date} {event.time}
        </div>
        <div className="event-detail">
          <strong>📍 会場:</strong> <span className="venue">{event.venue}</span>
        </div>
        <div className="event-detail">
          <strong>🎭 出演:</strong> {event.performers}
        </div>
      </div>

      {event.tags && event.tags.length > 0 && (
        <div className="event-tags">
          {event.tags.map((tag, index) => (
            <span key={index} className="event-tag">{tag}</span>
          ))}
        </div>
      )}

      <button className="register-btn">詳細を見る</button>
    </div>
  )
}

// Calendar View Component  
function CalendarView({ events, currentDate, setCurrentDate, onEventClick }) {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const weekdays = ['日', '月', '火', '水', '木', '金', '土']

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const previousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  // Generate calendar days
  const calendarDays = []
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate)
    cellDate.setDate(startDate.getDate() + i)
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === cellDate.toDateString()
    })

    calendarDays.push({
      date: cellDate,
      events: dayEvents,
      isOtherMonth: cellDate.getMonth() !== month,
      isToday: cellDate.toDateString() === new Date().toDateString()
    })
  }

  return (
    <>
      {/* Calendar Navigation */}
      <div className="calendar-navigation">
        <div className="calendar-nav-controls">
          <button className="nav-btn" onClick={previousMonth}>← 前月</button>
          <h2 id="currentMonthYear">{year}年{monthNames[month]}</h2>
          <button className="nav-btn" onClick={nextMonth}>翌月 →</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-view">
        {/* Headers */}
        {weekdays.map(day => (
          <div key={day} className="calendar-header">{day}</div>
        ))}
        
        {/* Days */}
        {calendarDays.map((day, index) => (
          <div 
            key={index}
            className={`calendar-day ${day.isOtherMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
          >
            <div className="day-number">{day.date.getDate()}</div>
            
            {day.events.length > 0 && (
              <div className="calendar-events">
                {day.events.slice(0, 3).map(event => (
                  <div 
                    key={event.id}
                    className={`calendar-event ${event.status === 'NEW!' ? 'new' : ''}`}
                    onClick={() => onEventClick(event)}
                    title={event.title}
                  >
                    {event.time} {event.title}
                  </div>
                ))}
                
                {day.events.length > 3 && (
                  <div className="event-count">
                    +{day.events.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

// Event Modal Component
function EventModal({ event, onClose }) {
  return (
    <div className="event-modal show">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>{event.title}</h2>
        
        <div className="event-details">
          <div className="event-detail">
            <strong>📅 日時:</strong> {event.date} {event.time}
          </div>
          <div className="event-detail">
            <strong>📍 会場:</strong> {event.venue}
          </div>
          {event.address && (
            <div className="event-detail">
              <strong>🗺️ 住所:</strong> {event.address}
            </div>
          )}
          <div className="event-detail">
            <strong>🎭 出演:</strong> {event.performers}
          </div>
          {event.description && (
            <div className="event-detail">
              <strong>📝 概要:</strong> {event.description}
            </div>
          )}
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

        {event.url && (
          <div style={{marginTop: '20px'}}>
            <a href={event.url} target="_blank" rel="noopener noreferrer" className="register-btn">
              公式サイトで詳細を見る
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App