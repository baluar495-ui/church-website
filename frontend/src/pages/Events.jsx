import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaSearch, FaFilter, FaTimes, FaWhatsapp, FaShareAlt, FaFacebook, FaTwitter, FaEnvelope, FaCopy, FaCheck } from 'react-icons/fa';
import { eventsAPI } from '../services/api';
import './Events.css';

function Events() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedEventType, setSelectedEventType] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [eventTypes, setEventTypes] = useState(['all']);
    const [copySuccess, setCopySuccess] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    // Helper function to check if event is still visible (not passed for more than 1 day)
    const isEventVisible = (eventDate) => {
        const event = new Date(eventDate);
        const today = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        
        // If event is in the future, keep it
        if (event >= today) return true;
        
        // If event passed, check if within 1 day
        const daysPassed = Math.floor((today - event) / oneDayInMs);
        return daysPassed < 1;
    };

    // Get unique months from events (only from visible events)
    const getMonths = () => {
        const visibleEvents = events.filter(event => isEventVisible(event.event_date));
        const months = visibleEvents.map(event => {
            const date = new Date(event.event_date);
            return date.toLocaleString('fr', { month: 'long', year: 'numeric' });
        });
        return ['all', ...new Set(months)];
    };

    // Fetch events from real database
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await eventsAPI.getAll();
            const eventsData = res.data.data || [];
            
            // Store all events
            setEvents(eventsData);
            
            // Extract unique event types from database
            const uniqueTypes = ['all', ...new Set(eventsData.map(event => event.type).filter(Boolean))];
            setEventTypes(uniqueTypes);
            
            // Apply visibility filter and sorting
            let visibleEvents = eventsData.filter(event => isEventVisible(event.event_date));
            visibleEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
            setFilteredEvents(visibleEvents);
            
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Impossible de charger les événements. Veuillez réessayer plus tard.');
            setEvents([]);
            setFilteredEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter events based on search, month, and type
    useEffect(() => {
        if (!events.length) {
            setFilteredEvents([]);
            return;
        }
        
        // Start with all visible events
        let filtered = events.filter(event => isEventVisible(event.event_date));
        
        // Search filter (title, description, location)
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(event =>
                (event.title && event.title.toLowerCase().includes(term)) ||
                (event.description && event.description.toLowerCase().includes(term)) ||
                (event.location && event.location.toLowerCase().includes(term))
            );
        }
        
        // Month filter
        if (selectedMonth !== 'all') {
            filtered = filtered.filter(event => {
                const eventMonth = new Date(event.event_date).toLocaleString('fr', { month: 'long', year: 'numeric' });
                return eventMonth === selectedMonth;
            });
        }
        
        // Event type filter
        if (selectedEventType !== 'all') {
            filtered = filtered.filter(event => event.type === selectedEventType);
        }
        
        // Sort by date (upcoming first)
        filtered.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
        
        setFilteredEvents(filtered);
    }, [searchTerm, selectedMonth, selectedEventType, events]);

    const formatDate = (dateString) => {
        if (!dateString) return { day: '?', month: '?', full: 'Date inconnue' };
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('fr', { month: 'short' }).toUpperCase(),
            full: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        };
    };

    const isUpcoming = (dateString) => {
        return new Date(dateString) >= new Date();
    };

    const isToday = (dateString) => {
        return new Date(dateString).toDateString() === new Date().toDateString();
    };

    // Add to Calendar function
    const addToCalendar = (event) => {
        const date = new Date(event.event_date);
        const endDate = new Date(date);
        endDate.setHours(endDate.getHours() + 2);
        
        const start = date.toISOString().replace(/-|:|\.\d+/g, '');
        const end = endDate.toISOString().replace(/-|:|\.\d+/g, '');
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        
        window.open(googleCalendarUrl, '_blank');
    };

    // Generate share message
    const generateShareMessage = (event) => {
        const websiteUrl = window.location.origin + '/events';
        const formattedDate = formatDate(event.event_date).full;
        return `📅 ${event.title}\n📍 ${event.location}\n⏰ ${formattedDate} à ${event.event_time}\n\n📖 ${event.description}\n\n🔗 ${websiteUrl}\n\nRejoignez-nous à la 8ème CEPAC PENUEL SWAHILOPHONE !`;
    };

    // Copy to clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        }
    };

    // Share with multiple platforms
    const shareEvent = (event, platform) => {
        const fullMessage = generateShareMessage(event);
        
        if (platform === 'facebook') {
            // Open popup with the message to copy
            setCurrentEvent(event);
            setShareMessage(fullMessage);
            setShowSharePopup(true);
            return;
        }
        
        const shareUrls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(fullMessage)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullMessage.substring(0, 280))}`,
            email: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(fullMessage)}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank');
        }
    };

    if (loading) {
        return (
            <div className="events-loading">
                <div className="spinner"></div>
                <p>Chargement des événements...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="events-error">
                <p>{error}</p>
                <button onClick={fetchEvents} className="btn-retry">Réessayer</button>
            </div>
        );
    }

    return (
        <div className="events-page">
            {/* Hero Section */}
            <section className="events-hero">
                <div className="events-hero-overlay"></div>
                <div className="events-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1>Événements</h1>
                        <p>Restez connectés à tout ce qui se passe dans notre communauté</p>
                    </motion.div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="events-filters">
                <div className="container">
                    <div className="filters-header">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher un événement (titre, description, lieu)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            className="filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter /> Filtres
                            {showFilters && <FaTimes />}
                        </button>
                    </div>

                    {showFilters && (
                        <motion.div 
                            className="filters-panel"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="filter-group">
                                <label>Période</label>
                                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                    {getMonths().map((month, index) => (
                                        <option key={index} value={month}>
                                            {month === 'all' ? 'Tous les mois' : month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Type d'événement</label>
                                <select value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)}>
                                    {eventTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type === 'all' ? 'Tous les types' : type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Results Count */}
            <div className="events-results-count">
                <div className="container">
                    <p>{filteredEvents.length} événement(s) trouvé(s)</p>
                </div>
            </div>

            {/* Events List */}
            <section className="events-list-section">
                <div className="container">
                    {filteredEvents.length === 0 ? (
                        <div className="no-events">
                            <p>Aucun événement trouvé pour ces critères.</p>
                            <button onClick={() => { 
                                setSearchTerm(''); 
                                setSelectedMonth('all'); 
                                setSelectedEventType('all');
                                setShowFilters(false);
                            }}>
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <div className="events-container">
                            {filteredEvents.map((event, index) => {
                                const date = formatDate(event.event_date);
                                const upcoming = isUpcoming(event.event_date);
                                const today = isToday(event.event_date);
                                
                                return (
                                    <motion.div
                                        key={event.id}
                                        className={`event-item ${!upcoming ? 'past-event' : ''}`}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="event-date-large">
                                            <span className="event-day">{date.day}</span>
                                            <span className="event-month">{date.month}</span>
                                        </div>
                                        
                                        <div className="event-details">
                                            <div className="event-header">
                                                <h3>{event.title}</h3>
                                                {event.type && (
                                                    <span className="event-type">{event.type}</span>
                                                )}
                                                {!upcoming && (
                                                    <span className="event-badge passé">Passé</span>
                                                )}
                                                {upcoming && today && (
                                                    <span className="event-badge aujourdhui">Aujourd'hui</span>
                                                )}
                                            </div>
                                            
                                            <p className="event-description">{event.description}</p>
                                            
                                            <div className="event-info">
                                                <div className="info-item">
                                                    <FaCalendarAlt />
                                                    <span>{date.full}</span>
                                                </div>
                                                <div className="info-item">
                                                    <FaClock />
                                                    <span>{event.event_time}</span>
                                                </div>
                                                <div className="info-item">
                                                    <FaMapMarkerAlt />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="event-actions">
                                                <button 
                                                    className="btn-add-calendar"
                                                    onClick={() => addToCalendar(event)}
                                                >
                                                    <FaCalendarAlt /> Ajouter au calendrier
                                                </button>
                                                
                                                <div className="share-dropdown">
                                                    <button className="btn-share">
                                                        <FaShareAlt /> Partager
                                                    </button>
                                                    <div className="share-dropdown-content">
                                                        <button onClick={() => shareEvent(event, 'whatsapp')}>
                                                            <FaWhatsapp color="#25D366" /> WhatsApp
                                                        </button>
                                                        <button onClick={() => shareEvent(event, 'facebook')}>
                                                            <FaFacebook color="#1877F2" /> Facebook
                                                        </button>
                                                        <button onClick={() => shareEvent(event, 'twitter')}>
                                                            <FaTwitter color="#1DA1F2" /> X (Twitter)
                                                        </button>
                                                        <button onClick={() => shareEvent(event, 'email')}>
                                                            <FaEnvelope color="#666" /> Email
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="events-cta">
                <div className="container">
                    <h2>Vous organisez un événement?</h2>
                    <p>Contactez-nous pour faire annoncer votre événement dans notre église</p>
                    <button className="btn-primary" onClick={() => window.location.href = '/contact'}>
                        Contacter l'équipe
                    </button>
                </div>
            </section>

            {/* Share Popup for Facebook */}
            {showSharePopup && currentEvent && (
                <div className="share-popup-overlay" onClick={() => setShowSharePopup(false)}>
                    <div className="share-popup" onClick={(e) => e.stopPropagation()}>
                        <button className="share-popup-close" onClick={() => setShowSharePopup(false)}>
                            <FaTimes />
                        </button>
                        <h3>Partager sur Facebook</h3>
                        <p>Copiez le message ci-dessous et collez-le dans Facebook :</p>
                        <div className="share-message-box">
                            <pre>{shareMessage}</pre>
                        </div>
                        <button 
                            className={`btn-copy ${copySuccess ? 'copied' : ''}`}
                            onClick={() => copyToClipboard(shareMessage)}
                        >
                            {copySuccess ? <FaCheck /> : <FaCopy />}
                            {copySuccess ? ' Copié !' : ' Copier le message'}
                        </button>
                        <p className="share-popup-hint">
                            <small>📌 Envoyez ce message à vos amis sur Facebook Messenger ou partagez-le sur votre timeline.</small>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;