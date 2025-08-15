import { Routes, Route } from 'react-router-dom'
import React from 'react';
import HomePage from './pages/HomePage'
import PlaygroundPage from './pages/PlaygroundPage'
import './App.css'

function App() {
  return (
    <div className="App">
      {/* You can add a permanent Header/Navbar component here if you want */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
      </Routes>
    </div>
  )
}

export default App