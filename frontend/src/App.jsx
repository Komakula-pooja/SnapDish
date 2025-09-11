import { Routes, Route } from 'react-router-dom'
import React from 'react';
import HomePage from './pages/HomePage'
import PlaygroundPage from './pages/PlaygroundPage'
import AuthPage from './pages/AuthPage';
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
      </Routes>
    </div>
  )
}

export default App