import { Routes, Route } from 'react-router-dom'
import NavBar       from './components/NavBar'
import HomePage     from './pages/HomePage'
import TracingPage  from './pages/TracingPage'
import AdminPage    from './pages/AdminPage'
import ProgressPage from './pages/ProgressPage'
import ShlokasPage  from './pages/ShlokasPage'

export default function App() {
  return (
    <div style={{ minHeight: '100svh', background: '#FBF4E4' }}>
      <NavBar />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/tracing"  element={<TracingPage />} />
        <Route path="/shlokas"  element={<ShlokasPage />} />
        <Route path="/admin"    element={<AdminPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </div>
  )
}
