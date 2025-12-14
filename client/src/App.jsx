import { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import './App.css'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')
  const [socketConnected, setSocketConnected] = useState(false)

  useEffect(() => {
    // Test backend API connection
    const checkServer = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health')
        setServerStatus(response.data.status)
      } catch (error) {
        setServerStatus('Server is offline')
        console.error('Error connecting to server:', error)
      }
    }

    checkServer()

    // Connect to Socket.IO server
    const socket = io('http://localhost:5000')

    socket.on('connect', () => {
      console.log('Connected to Socket')
      setSocketConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket')
      setSocketConnected(false)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="App">
      <h1>Real-Time Pest Alert System</h1>
      
      <div className="status-container">
        <div className="status-card">
          <h2>Backend Status</h2>
          <p className={serverStatus.includes('running') ? 'status-success' : 'status-error'}>
            {serverStatus}
          </p>
        </div>

        <div className="status-card">
          <h2>Socket.IO Status</h2>
          <p className={socketConnected ? 'status-success' : 'status-error'}>
            {socketConnected ? '✅ Connected' : '❌ Disconnected'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
