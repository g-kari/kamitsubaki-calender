import React from 'react'

function Navigation({ currentView, onViewChange }) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <button 
          className={`nav-button ${currentView === 'grid' ? 'active' : ''}`}
          onClick={() => onViewChange('grid')}
        >
          カレンダー
        </button>
        <button 
          className={`nav-button ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => onViewChange('calendar')}
        >
          イベント情報
        </button>
      </div>
    </nav>
  )
}

export default Navigation