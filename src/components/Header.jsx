import React from 'react'

function Header() {
  return (
    <header className="new-header">
      <div className="header-container">
        <div className="header-left">
          <div className="header-logo">
            <span className="logo-text">神椿</span>
          </div>
          <div className="header-titles">
            <h1 className="header-main-title">神椿市建設中。</h1>
            <p className="header-subtitle">KAMITSUBAKI CITY UNDER CONSTRUCTION</p>
          </div>
        </div>
        <div className="header-right">
          <div className="header-brand">W✕W</div>
          <div className="header-tagline">Virtual Witch Phenomenon</div>
        </div>
      </div>
    </header>
  )
}

export default Header