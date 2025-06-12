import React from 'react'

function FilterSection({
  viewMode,
  dateFilter,
  artistFilter,
  searchInput,
  onViewModeChange,
  onDateFilterChange,
  onArtistFilterChange,
  onSearchInputChange,
  currentCalendarDate,
  onPreviousMonth,
  onNextMonth
}) {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  return (
    <>
      <div className="filter-section">
        <h3>🔍 イベントを絞り込み</h3>
        <div className="filter-controls">
          <div className="filter-group">
            <label>📊 表示形式:</label>
            <select 
              className="filter-select" 
              value={viewMode}
              onChange={(e) => onViewModeChange(e.target.value)}
            >
              <option value="grid">グリッド表示</option>
              <option value="calendar">カレンダー表示</option>
            </select>
          </div>
          <div className="filter-group">
            <label>📅 期間:</label>
            <select 
              className="filter-select" 
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
            >
              <option value="all">すべて</option>
              <option value="upcoming">今後のイベント</option>
              <option value="thisWeek">今週</option>
              <option value="thisMonth">今月</option>
              <option value="next3Months">今後3か月</option>
            </select>
          </div>
          <div className="filter-group">
            <label>🎭 アーティスト:</label>
            <select 
              className="filter-select" 
              value={artistFilter}
              onChange={(e) => onArtistFilterChange(e.target.value)}
            >
              <option value="all">すべて</option>
              <option value="kafu">花譜</option>
              <option value="rime">理芽</option>
              <option value="harusaruhi">春猿火</option>
              <option value="isekaijoucho">ヰ世界情緒</option>
              <option value="koko">幸祜</option>
              <option value="meto">明透</option>
              <option value="vwp">V.W.P</option>
            </select>
          </div>
          <div className="filter-group">
            <input 
              type="text" 
              className="search-input" 
              placeholder="🔍 イベントを検索..." 
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {viewMode === 'calendar' && (
        <div className="calendar-navigation">
          <div className="calendar-nav-controls">
            <button className="nav-btn" onClick={onPreviousMonth}>
              ← 前月
            </button>
            <h2 id="currentMonthYear">
              {currentCalendarDate.getFullYear()}年{monthNames[currentCalendarDate.getMonth()]}
            </h2>
            <button className="nav-btn" onClick={onNextMonth}>
              次月 →
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default FilterSection