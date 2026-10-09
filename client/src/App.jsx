import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { CreateCarPage } from './pages/CreateCarPage'
import { CarsListPage } from './pages/CarsListPage'
import { CarDetailPage } from './pages/CarDetailPage'
import { EditCarPage } from './pages/EditCarPage'
import './App.css'

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CreateCarPage />} />
            <Route path="/cars" element={<CarsListPage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
            <Route path="/cars/:id/edit" element={<EditCarPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} DIY Auto Crafter — Unit 4 DIY Delight Personalizer</p>
        </footer>
      </div>
    </Router>
  )
}
