import React from 'react'

function Navigation({ currentView, onViewChange }) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <button 
          className={`nav-button ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => onViewChange('calendar')}
        >
          カレンダー
        </button>
        <button 
          className={`nav-button ${currentView === 'events' ? 'active' : ''}`}
          onClick={() => onViewChange('events')}
        >
          イベント情報
        </button>
      </div>
    </nav>
  )
}

export default Navigation