import { useState, useEffect } from 'react'
import Markdown from "react-markdown"
import axios from 'axios'

const Chat = () => {
  const [ code, setCode ] = useState(`function sum() {
  return 1 + 1
}`)
  const [ review, setReview ] = useState('')
  const [ chats, setChats ] = useState([])
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/is-auth', { withCredentials: true })
        if (res.data?.success) {
          await fetchLatest()
        }
      } catch (e) {
        console.log('Not authenticated')
      }
    })()
  }, [])

  async function reviewCode() {
    if (!code.trim()) return
    
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/ai/get-review', { code }, { withCredentials: true })
      if (response.data?.success) {
        setReview(response.data.review)
        await fetchLatest()
      }
    } catch (error) {
      console.error('Error getting review:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLatest() {
    try {
      const res = await axios.get('http://localhost:5000/api/ai/latest', { withCredentials: true })
      if (res.data?.success) setChats(res.data.chats || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  }

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', gap: '20px' }}>
      {/* Left side - Code input */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Enter Your code</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here..."
          style={{
            flex: 1,
            padding: '15px',
            fontSize: '14px',
            fontFamily: 'monospace',
            border: '1px solid #ddd',
            borderRadius: '8px',
            resize: 'none',
            backgroundColor: '#9cb2cbff'
           
            
          }}
        />
        <button
          onClick={reviewCode}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#00bbffff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Getting Review...' : 'Get Review'}
        </button>
      </div>

      {/* Right side - Review and Chat history */}
      <div style={{ flex: 1, display: 'flex', gap: '20px' }}>
        {/* Review output */}
        <div style={{ flex: 2 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Review</h3>
          <div style={{
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: 'white',
            minHeight: '200px',
            maxHeight: '60vh',
            overflow: 'auto'
          }}>
            {review ? (
              <Markdown>{review}</Markdown>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Click "Get Review" to see the AI analysis of your code.
              </p>
            )}
          </div>
        </div>

        {/* Chat history */}
        <div style={{ flex: 1, borderLeft: '1px solid #ddd', paddingLeft: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Recent Reviews</h3>
          <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
            {chats.length > 0 ? (
              chats.map((chat, index) => (
                <div
                  key={index}
                  onClick={() => { setCode(chat.code); setReview(chat.review) }}
                  style={{
                    padding: '10px',
                    border: '1px solid #eee',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    backgroundColor: '#f8f9fa',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                >
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    {new Date(chat.createdAt).toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#333',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    maxHeight: '60px'
                  }}>
                    {chat.code.slice(0, 100)}{chat.code.length > 100 ? '...' : ''}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic', fontSize: '14px' }}>
                No previous reviews yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
