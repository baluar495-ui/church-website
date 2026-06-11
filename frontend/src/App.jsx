import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sermons" element={<ComingSoon title="Prédications" />} />
                    <Route path="/events"  element={<ComingSoon title="Événements" />} />
                    <Route path="/prayer"  element={<ComingSoon title="Prière" />} />
                    <Route path="/contact" element={<ComingSoon title="Contact" />} />
                </Routes>
            </div>
        </Router>
    );
}

function ComingSoon({ title }) {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#0F2057', color: '#fff', fontFamily: 'Inter, sans-serif'
        }}>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px,5vw,64px)', color: '#F5C518', margin: '0 0 16px' }}>{title}</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>Page en cours de construction — revenez bientôt.</p>
        </div>
    );
}

export default App;