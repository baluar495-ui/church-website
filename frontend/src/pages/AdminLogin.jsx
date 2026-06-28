import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaChurch, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:3003/api/admin/login', {
                username,
                password
            });

            console.log('Login response:', res.data);

            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token);
                localStorage.setItem('adminUser', JSON.stringify(res.data.user));
                
                // Call the onLogin callback
                onLogin(res.data.user);
                
                // Navigate to dashboard
                navigate('/admin/dashboard');
            } else {
                setError('Erreur de connexion');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <motion.div
                    className="admin-login-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="admin-login-header">
                        <FaChurch className="admin-login-icon" />
                        <h1>Administration</h1>
                        <p>8ème CEPAC PENUEL SWAHILOPHONE</p>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="admin-form-group">
                            <label>
                                <FaUser className="admin-form-icon" />
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                placeholder="Entrez votre nom d'utilisateur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>
                                <FaLock className="admin-form-icon" />
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="admin-login-error">{error}</div>}

                        <button type="submit" className="admin-login-btn" disabled={loading}>
                            <FaSignInAlt />
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <p>Accès réservé aux administrateurs</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default AdminLogin;