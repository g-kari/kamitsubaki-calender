import React from 'react'

function UpdateInfo({ 
  loading, 
  lastUpdateTime, 
  autoUpdateEnabled, 
  onToggleAutoUpdate, 
  onUpdateNow, 
  error, 
  successMessage 
}) {
  const formatLastUpdate = () => {
    if (!lastUpdateTime) return '手動更新待ち'
    return lastUpdateTime.toLocaleString('ja-JP')
  }

  return (
    <>
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message show">
          {successMessage}
        </div>
      )}
      
      <div className="update-info">
        <div className="update-status">
          <span>📡 最終更新: {formatLastUpdate()}</span>
          {loading && <div className="loading-spinner"></div>}
        </div>
        <div className="update-controls">
          <button className="update-btn" onClick={onUpdateNow} disabled={loading}>
            🔄 今すぐ更新
          </button>
          <div className="auto-update-toggle">
            <span>自動更新:</span>
            <div 
              className={`toggle-switch ${autoUpdateEnabled ? 'active' : ''}`} 
              onClick={onToggleAutoUpdate}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateInfo