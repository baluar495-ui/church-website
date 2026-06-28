import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Sermons from './pages/sermons';
import Events from './pages/Events';
import Prayer from './pages/Prayer';
import Giving from './pages/Giving';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const userData = localStorage.getItem('adminUser');
        
        console.log('Token:', token);
        console.log('User Data:', userData);
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
                console.log('User authenticated:', parsedUser);
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        console.log('Login successful:', userData);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        setUser(null);
    };

    // Protected route wrapper
    const ProtectedRoute = ({ children }) => {
        console.log('ProtectedRoute check - isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) {
            return <Navigate to="/admin/login" replace />;
        }
        return children;
    };

    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Chargement...</div>;
    }

    return (
        <NotificationProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<><Navbar /><Home /></>} />
                        <Route path="/sermons" element={<><Navbar /><Sermons /></>} />
                        <Route path="/events" element={<><Navbar /><Events /></>} />
                        <Route path="/prayer" element={<><Navbar /><Prayer /></>} />
                        <Route path="/giving" element={<><Navbar /><Giving /></>} />
                        <Route path="/contact" element={<><Navbar /><Contact /></>} />
                        
                        {/* Admin routes */}
                        <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute>
                                <AdminDashboard user={user} onLogout={handleLogout} />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </NotificationProvider>
    );
}

export default App;