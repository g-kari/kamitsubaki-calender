import React from 'react'

function StatsSection({ stats }) {
  return (
    <div className="stats-section">
      <div className="stat-card">
        <div className="stat-number">{stats.total}</div>
        <div className="stat-label">総イベント数</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.upcoming}</div>
        <div className="stat-label">今後のイベント</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.thisMonth}</div>
        <div className="stat-label">今月のイベント</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.new}</div>
        <div className="stat-label">新着イベント</div>
      </div>
    </div>
  )
}

export default StatsSection