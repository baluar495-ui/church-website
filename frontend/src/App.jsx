import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Sermons from './pages/sermons';
import Events from './pages/Events';
import Prayer from './pages/Prayer';
import Giving from './pages/Giving';
import Contact from './pages/Contact';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sermons" element={<Sermons />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/prayer" element={<Prayer />} />
                    <Route path="/giving" element={<Giving />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;