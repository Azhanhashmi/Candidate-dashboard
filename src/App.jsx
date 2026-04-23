import { useState } from 'react'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import './index.css'

export default function App() {
  const [page, setPage] = useState('home')

  return page === 'home'
    ? <Home onEnter={() => setPage('dashboard')} />
    : <Dashboard onBack={() => setPage('home')} />
}
