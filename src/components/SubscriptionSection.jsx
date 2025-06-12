import React, { useState } from 'react'

function SubscriptionSection({ onSubscribe }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubscribe(email)
    setEmail('')
  }

  return (
    <div className="subscription-section">
      <h3>📧 イベント通知を受け取る</h3>
      <p>新しいイベントが追加されたときにメール通知を受け取れます</p>
      <form onSubmit={handleSubmit} className="subscription-input">
        <input 
          type="email" 
          className="email-input" 
          placeholder="メールアドレスを入力" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="subscribe-btn">
          🔔 通知を受け取る
        </button>
      </form>
    </div>
  )
}

export default SubscriptionSection