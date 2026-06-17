import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPray, FaHands, FaHeart, FaUser, FaEnvelope, FaGlobe, FaCheckCircle, FaClock, FaTimes, FaPrayingHands, FaCheck } from 'react-icons/fa';
import { prayerAPI } from '../services/api';
import './Prayer.css';

function Prayer() {
    const [prayerRequests, setPrayerRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        request: '',
        is_public: true
    });
    const [formErrors, setFormErrors] = useState({});
    // Prayer confirmation modal
    const [showPrayerModal, setShowPrayerModal] = useState(false);
    const [prayerMessage, setPrayerMessage] = useState('');
    const [prayerCount, setPrayerCount] = useState(0);
    const [currentPrayerId, setCurrentPrayerId] = useState(null);
    // Track prayed requests - load from localStorage immediately
    const [prayedRequests, setPrayedRequests] = useState(() => {
        const saved = localStorage.getItem('prayedRequests');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    // Save prayed requests to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('prayedRequests', JSON.stringify(prayedRequests));
        console.log('Prayed requests saved:', prayedRequests); // Debug log
    }, [prayedRequests]);

    // Fetch public prayer requests
    const fetchPrayerRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await prayerAPI.getPublic();
            const data = res.data.data || [];
            setPrayerRequests(data);
        } catch (error) {
            console.error('Error fetching prayer requests:', error);
            setError('Impossible de charger les demandes de prière. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrayerRequests();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!formData.request.trim()) {
            errors.request = 'Veuillez entrer votre demande de prière';
        }
        if (formData.request.trim().length < 10) {
            errors.request = 'Votre demande doit contenir au moins 10 caractères';
        }
        if (formData.name.trim() && formData.name.trim().length < 2) {
            errors.name = 'Le nom doit contenir au moins 2 caractères';
        }
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Veuillez entrer une adresse email valide';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit prayer request
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                name: formData.name.trim() || 'Anonyme',
                email: formData.email.trim() || null,
                request: formData.request.trim(),
                is_public: formData.is_public
            };
            
            await prayerAPI.submit(payload);
            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                request: '',
                is_public: true
            });
            setTimeout(() => {
                fetchPrayerRequests();
                setSubmitSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting prayer request:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    // Check if user has already prayed for this request
    const hasPrayedFor = (requestId) => {
        // Ensure we're checking correctly
        const result = prayedRequests.includes(requestId);
        console.log(`Checking prayer ${requestId}: ${result}`); // Debug log
        return result;
    };

    // Handle "Pray for this request"
    const handlePrayForRequest = async (request) => {
        // Check if already prayed
        if (hasPrayedFor(request.id)) {
            setPrayerMessage(`🙏 Vous avez déjà prié pour ${request.name || 'ce frère/sœur'} !`);
            setPrayerCount(request.prayer_count || 0);
            setShowPrayerModal(true);
            setTimeout(() => setShowPrayerModal(false), 3000);
            return;
        }

        try {
            const res = await prayerAPI.incrementPrayer(request.id);
            if (res.data.success) {
                // Add to prayed requests list (immutable update)
                const updatedPrayedRequests = [...prayedRequests, request.id];
                setPrayedRequests(updatedPrayedRequests);
                
                // Also save immediately to localStorage
                localStorage.setItem('prayedRequests', JSON.stringify(updatedPrayedRequests));
                
                // Update the prayer count in the local state
                setPrayerRequests(prevRequests => 
                    prevRequests.map(req => 
                        req.id === request.id 
                            ? { ...req, prayer_count: (req.prayer_count || 0) + 1 }
                            : req
                    )
                );
                
                // Show the modal
                setCurrentPrayerId(request.id);
                setPrayerCount((request.prayer_count || 0) + 1);
                setPrayerMessage(`🙏 Merci d'avoir prié pour ${request.name || 'ce frère/sœur'} !`);
                setShowPrayerModal(true);
                
                // Auto-hide modal after 4 seconds
                setTimeout(() => {
                    setShowPrayerModal(false);
                }, 4000);
            }
        } catch (error) {
            console.error('Error praying for request:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Debug: Log prayedRequests on render
    console.log('Current prayedRequests:', prayedRequests);

    return (
        <div className="prayer-page">
            {/* Hero Section */}
            <section className="prayer-hero">
                <div className="prayer-hero-overlay"></div>
                <div className="prayer-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <FaPray className="prayer-hero-icon" />
                        <h1>Prière</h1>
                        <p>Confiez vos fardeaux à Dieu. Nous prions avec vous.</p>
                    </motion.div>
                </div>
            </section>

            {/* Prayer Request Form */}
            <section className="prayer-form-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="prayer-form-wrapper"
                    >
                        <div className="prayer-form-header">
                            <h2>Soumettre une demande de prière</h2>
                            <p>Partagez votre fardeau avec nous. Nous nous engageons à prier pour vous.</p>
                        </div>

                        {submitSuccess && (
                            <div className="prayer-success">
                                <FaCheckCircle />
                                <div>
                                    <h4>Demande soumise avec succès !</h4>
                                    <p>Merci de nous avoir confié votre prière. Nous prions pour vous.</p>
                                </div>
                            </div>
                        )}

                        {error && !submitSuccess && (
                            <div className="prayer-error">
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="prayer-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">
                                        <FaUser /> Votre nom
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Ex: Sœur Marie (optionnel)"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={formErrors.name ? 'error' : ''}
                                    />
                                    {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        <FaEnvelope /> Votre email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="marie@email.com (optionnel)"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={formErrors.email ? 'error' : ''}
                                    />
                                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="request">
                                    <FaHands /> Votre demande de prière
                                </label>
                                <textarea
                                    id="request"
                                    name="request"
                                    placeholder="Écrivez votre demande de prière ici..."
                                    rows="5"
                                    value={formData.request}
                                    onChange={handleInputChange}
                                    className={formErrors.request ? 'error' : ''}
                                ></textarea>
                                {formErrors.request && <span className="error-message">{formErrors.request}</span>}
                                <small>{formData.request.length} caractères (minimum 10)</small>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_public"
                                        checked={formData.is_public}
                                        onChange={handleInputChange}
                                    />
                                    <span><FaGlobe /> Rendre ma demande publique</span>
                                </label>
                                <p className="checkbox-hint">
                                    Si vous cochez cette case, votre demande sera visible par d'autres personnes 
                                    qui pourront prier avec vous. Sinon, elle restera privée (seule notre équipe de prière la verra).
                                </p>
                            </div>

                            <div className="form-group">
                                <button 
                                    type="submit" 
                                    className="btn-submit"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-small"></span> Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <FaPray /> Soumettre ma demande
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Public Prayer Requests */}
            <section className="prayer-list-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="prayer-list-header">
                            <h2>Demandes de prière publiques</h2>
                            <p>Élevez vos prières pour nos frères et sœurs</p>
                        </div>

                        {loading ? (
                            <div className="prayer-loading">
                                <div className="spinner"></div>
                                <p>Chargement des demandes de prière...</p>
                            </div>
                        ) : error && prayerRequests.length === 0 ? (
                            <div className="prayer-error-state">
                                <p>{error}</p>
                                <button onClick={fetchPrayerRequests} className="btn-retry">Réessayer</button>
                            </div>
                        ) : prayerRequests.length === 0 ? (
                            <div className="no-prayers">
                                <FaPray />
                                <p>Aucune demande de prière publique pour le moment.</p>
                                <p>Vous pouvez être le premier à partager une demande !</p>
                            </div>
                        ) : (
                            <div className="prayer-grid">
                                {prayerRequests.map((request, index) => {
                                    const alreadyPrayed = hasPrayedFor(request.id);
                                    return (
                                        <motion.div
                                            key={request.id}
                                            className="prayer-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="prayer-card-header">
                                                <div className="prayer-name">
                                                    <FaUser />
                                                    <span>{request.name || 'Anonyme'}</span>
                                                </div>
                                                <div className="prayer-date">
                                                    <FaClock />
                                                    <span>{formatDate(request.created_at)}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="prayer-card-body">
                                                <p>{request.request}</p>
                                            </div>
                                            
                                            <div className="prayer-card-footer">
                                                <div className="prayer-stats">
                                                    <span className="prayer-count">
                                                        <FaPrayingHands />
                                                        {request.prayer_count || 0} {request.prayer_count === 1 ? 'personne a prié' : 'personnes ont prié'}
                                                    </span>
                                                    {alreadyPrayed && (
                                                        <span className="prayed-badge">
                                                            <FaCheck /> Vous avez prié
                                                        </span>
                                                    )}
                                                </div>
                                                <button 
                                                    className={`btn-pray ${alreadyPrayed ? 'btn-prayed' : ''}`}
                                                    onClick={() => handlePrayForRequest(request)}
                                                    disabled={alreadyPrayed}
                                                >
                                                    {alreadyPrayed ? (
                                                        <>
                                                            <FaCheck /> Déjà prié
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaHands /> Je prie pour vous
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="prayer-cta">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <FaHeart className="cta-icon" />
                        <h2>Nous croyons au pouvoir de la prière</h2>
                        <p>"Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces." — Philippiens 4:6</p>
                        <button 
                            className="btn-primary"
                            onClick={() => {
                                document.querySelector('.prayer-form-section').scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Soumettre ma demande
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Prayer Confirmation Modal */}
            {showPrayerModal && (
                <div className="prayer-modal-overlay" onClick={() => setShowPrayerModal(false)}>
                    <motion.div 
                        className="prayer-modal"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="prayer-modal-close" onClick={() => setShowPrayerModal(false)}>
                            <FaTimes />
                        </button>
                        <div className="prayer-modal-icon">
                            <FaPrayingHands />
                        </div>
                        <h3>{prayerMessage.includes('déjà') ? 'Déjà prié ! 🙏' : 'Merci d\'avoir prié ! 🙏'}</h3>
                        <p>{prayerMessage}</p>
                        <div className="prayer-modal-count">
                            <span className="prayer-modal-number">{prayerCount}</span>
                            <span className="prayer-modal-label">{prayerCount === 1 ? 'personne a prié' : 'personnes ont prié'}</span>
                        </div>
                        <button 
                            className="prayer-modal-btn"
                            onClick={() => setShowPrayerModal(false)}
                        >
                            <FaHeart /> Merci
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Prayer;