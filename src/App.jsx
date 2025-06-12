import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import UpdateInfo from './components/UpdateInfo'
import StatsSection from './components/StatsSection'
import SubscriptionSection from './components/SubscriptionSection'
import FilterSection from './components/FilterSection'
import EventsDisplay from './components/EventsDisplay'
import EventModal from './components/EventModal'
import NotificationBadge from './components/NotificationBadge'

function App() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [currentViewMode, setCurrentViewMode] = useState('grid')
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('all')
  const [artistFilter, setArtistFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')

  // Load subscribers from localStorage
  useEffect(() => {
    try {
      const savedSubscribers = JSON.parse(localStorage.getItem('kamitsubaki_subscribers') || '[]')
      setSubscribers(savedSubscribers)
    } catch (e) {
      setSubscribers([])
    }
  }, [])

  // Load events on component mount
  useEffect(() => {
    loadEvents()
  }, [])

  // Auto-update functionality
  useEffect(() => {
    let interval
    if (autoUpdateEnabled) {
      interval = setInterval(() => {
        updateEvents()
      }, 30 * 60 * 1000) // 30 minutes
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoUpdateEnabled])

  // Load events from JSON file
  const loadEvents = async () => {
    try {
      const response = await fetch('./data/events.json')
      const data = await response.json()
      const eventsData = data.events || []
      
      // Auto-generate tags for events
      const eventsWithTags = eventsData.map(event => ({
        ...event,
        tags: autoGenerateTags(event)
      }))
      
      setEvents(eventsWithTags)
      setFilteredEvents(eventsWithTags)
      setLastUpdateTime(new Date(data.lastUpdated))
    } catch (error) {
      console.error('イベントの読み込みに失敗しました:', error)
      setError('イベントデータの読み込みに失敗しました')
      // Load fallback events
      loadFallbackEvents()
    }
  }

  // Auto-generate tags based on event content
  const autoGenerateTags = (event) => {
    const tags = []
    const title = event.title?.toLowerCase() || ''
    const performers = event.performers?.toLowerCase() || ''
    
    // Category-based tags
    if (title.includes('ライブ') || title.includes('live')) tags.push('ライブ')
    if (title.includes('配信') || title.includes('stream')) tags.push('配信')
    if (title.includes('ファンミ') || title.includes('meeting')) tags.push('ファンミ')
    if (title.includes('体験') || title.includes('mr')) tags.push('体験')
    if (title.includes('トーク')) tags.push('トーク')
    
    // Artist-based tags
    if (performers.includes('花譜')) tags.push('花譜')
    if (performers.includes('理芽')) tags.push('理芽')
    if (performers.includes('春猿火')) tags.push('春猿火')
    if (performers.includes('ヰ世界情緒')) tags.push('ヰ世界情緒')
    if (performers.includes('幸祜')) tags.push('幸祜')
    if (performers.includes('明透')) tags.push('明透')
    
    return tags
  }

  // Load fallback events
  const loadFallbackEvents = () => {
    const fallbackEvents = [
      {
        id: 'fallback-1',
        title: "神椿市建設中。MRコンテンツ体験会（東京会場）",
        date: "2025-12-01",
        time: "14:00",
        endTime: "18:00",
        venue: "Tokyo XR World",
        address: "東京都渋谷区",
        performers: "KAMITSUBAKI STUDIO",
        category: "experience",
        ticketInfo: "事前予約制",
        description: "最新のMR技術を使った神椿市の世界観を体験できます",
        tags: ["MR", "体験会"],
        status: "",
        url: "https://kamitsubaki.jp/event/"
      }
    ]
    setEvents(fallbackEvents)
    setFilteredEvents(fallbackEvents)
  }

  // Update events from server
  const updateEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate fetching from server (in real implementation, this would call the fetch script)
      const response = await fetch('./data/events.json')
      const data = await response.json()
      const newEvents = data.events || []
      
      // Check for new events
      const existingIds = events.map(e => e.id)
      const newEventCount = newEvents.filter(e => !existingIds.includes(e.id)).length
      
      // Mark new events
      const eventsWithStatus = newEvents.map(event => ({
        ...event,
        status: !existingIds.includes(event.id) ? 'NEW!' : event.status,
        tags: autoGenerateTags(event)
      }))
      
      setEvents(eventsWithStatus)
      setLastUpdateTime(new Date())
      
      if (newEventCount > 0) {
        showSuccessMessage(`${newEventCount}件の新しいイベントが見つかりました！`)
        showNotificationBadge(`${newEventCount}件の新イベント`)
        
        // Send browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('KAMITSUBAKI カレンダー', {
            body: `${newEventCount}件の新しいイベントが追加されました`,
            icon: '/favicon.ico'
          })
        }
      }
      
    } catch (error) {
      console.error('Update error:', error)
      setError('イベント情報の更新に失敗しました。しばらくしてからもう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }, [events])

  // Apply filters to events
  const applyFilters = useCallback(() => {
    let filtered = [...events]
    
    // Date filter
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (dateFilter) {
      case 'upcoming':
        filtered = filtered.filter(event => new Date(event.date) >= today)
        break
      case 'thisWeek':
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date)
          return eventDate >= today && eventDate < nextWeek
        })
        break
      case 'thisMonth':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date)
          return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
        })
        break
      case 'next3Months':
        const next3Months = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date)
          return eventDate >= today && eventDate <= next3Months
        })
        break
    }
    
    // Artist filter
    if (artistFilter !== 'all') {
      const artistMap = {
        'kafu': '花譜',
        'rime': '理芽',
        'harusaruhi': '春猿火',
        'isekaijoucho': 'ヰ世界情緒',
        'koko': '幸祜',
        'meto': '明透',
        'vwp': 'V.W.P'
      }
      const artistName = artistMap[artistFilter]
      if (artistName) {
        filtered = filtered.filter(event => 
          event.performers?.includes(artistName) || 
          event.tags?.includes(artistName)
        )
      }
    }
    
    // Search filter
    if (searchInput.trim()) {
      const searchTerm = searchInput.toLowerCase()
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(searchTerm) ||
        event.performers?.toLowerCase().includes(searchTerm) ||
        event.venue?.toLowerCase().includes(searchTerm) ||
        event.description?.toLowerCase().includes(searchTerm)
      )
    }
    
    setFilteredEvents(filtered)
  }, [events, dateFilter, artistFilter, searchInput])

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Show success message
  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Show notification badge
  const showNotificationBadge = (message) => {
    setNotificationMessage(message)
    setTimeout(() => setNotificationMessage(''), 5000)
  }

  // Subscribe to notifications
  const subscribeToNotifications = (email) => {
    if (!email || !email.includes('@')) {
      setError('有効なメールアドレスを入力してください')
      return
    }
    
    if (!subscribers.includes(email)) {
      const newSubscribers = [...subscribers, email]
      setSubscribers(newSubscribers)
      try {
        localStorage.setItem('kamitsubaki_subscribers', JSON.stringify(newSubscribers))
      } catch (e) {
        console.log('ローカルストレージに保存できませんが、セッション中は有効です')
      }
      showSuccessMessage('通知登録が完了しました！')
    } else {
      setError('このメールアドレスは既に登録されています')
    }
  }

  // Calculate statistics
  const calculateStats = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    return {
      total: events.length,
      upcoming: events.filter(event => new Date(event.date) >= today).length,
      thisMonth: events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
      }).length,
      new: events.filter(event => event.status === 'NEW!').length
    }
  }

  const stats = calculateStats()

  return (
    <div className="container">
      <Header />
      
      <Navigation 
        currentView={currentViewMode}
        onViewChange={setCurrentViewMode}
      />
      
      <UpdateInfo
        loading={loading}
        lastUpdateTime={lastUpdateTime}
        autoUpdateEnabled={autoUpdateEnabled}
        onToggleAutoUpdate={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
        onUpdateNow={updateEvents}
        error={error}
        successMessage={successMessage}
      />
      
      <StatsSection stats={stats} />
      
      <SubscriptionSection onSubscribe={subscribeToNotifications} />
      
      <FilterSection
        viewMode={currentViewMode}
        dateFilter={dateFilter}
        artistFilter={artistFilter}
        searchInput={searchInput}
        onViewModeChange={setCurrentViewMode}
        onDateFilterChange={setDateFilter}
        onArtistFilterChange={setArtistFilter}
        onSearchInputChange={setSearchInput}
        currentCalendarDate={currentCalendarDate}
        onPreviousMonth={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))}
        onNextMonth={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))}
      />
      
      <EventsDisplay
        events={filteredEvents}
        viewMode={currentViewMode}
        currentCalendarDate={currentCalendarDate}
        onEventClick={setSelectedEvent}
      />
      
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      
      {notificationMessage && (
        <NotificationBadge message={notificationMessage} />
      )}
    </div>
  )
}

export default App