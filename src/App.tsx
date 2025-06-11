import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './home/page'
import AttributionPage from './attribution/page'
import ConsultationPage from './consultation/page'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/attribution" element={<AttributionPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
      </Routes>
    </Router>
  )
}

export default App