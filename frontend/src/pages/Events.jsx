import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { eventsAPI } from '../services/api';
import './Events.css';

function Events() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedEventType, setSelectedEventType] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Helper function to check if event is still visible (not passed for more than 1 day)
    const isEventVisible = (eventDate) => {
        const event = new Date(eventDate);
        const today = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        
        // If event is in the future, keep it
        if (event >= today) return true;
        
        // If event passed, check if within 1 day
        const daysPassed = Math.floor((today - event) / oneDayInMs);
        return daysPassed < 1; // Event disappears after 1 full day
    };

    // Get unique months from visible events
    const getMonths = () => {
        const months = events
            .filter(event => isEventVisible(event.event_date))
            .map(event => {
                const date = new Date(event.event_date);
                return date.toLocaleString('fr', { month: 'long', year: 'numeric' });
            });
        return ['all', ...new Set(months)];
    };

    const eventTypes = ['all', 'Culte', 'Étude Biblique', 'Prière', 'Conférence', 'Jeunesse', 'Femmes', 'École du Dimanche'];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await eventsAPI.getAll();
                const eventsData = res.data.data || [];
                setEvents(eventsData);
                
                // Apply visibility filter and sorting
                let visibleEvents = eventsData.filter(event => isEventVisible(event.event_date));
                
                // Sort: upcoming events first (closest date first)
                visibleEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
                
                setFilteredEvents(visibleEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                // Demo data
                const demoData = [
                    {
                        id: 1,
                        title: 'Culte Principal du Dimanche',
                        description: 'Rejoignez-nous pour un moment puissant de louange, d\'adoration et d\'enseignement de la Parole de Dieu.',
                        event_date: '2026-06-16',
                        event_time: '10:00',
                        location: 'Temple Central, Goma',
                        type: 'Culte'
                    },
                    {
                        id: 2,
                        title: 'Étude Biblique Hebdomadaire',
                        description: 'Étude approfondie de la Parole de Dieu en petit groupe. Thème: La Foi qui vainc le monde.',
                        event_date: '2026-06-18',
                        event_time: '19:00',
                        location: 'Salle de Fellowship',
                        type: 'Étude Biblique'
                    },
                    {
                        id: 3,
                        title: 'Nuit de Prière',
                        description: 'Une nuit spéciale dédiée à la prière et à l\'intercession pour notre église, notre ville et notre nation.',
                        event_date: '2026-06-20',
                        event_time: '22:00',
                        location: 'Temple Central',
                        type: 'Prière'
                    },
                    {
                        id: 4,
                        title: 'Conférence des Jeunes',
                        description: 'Un week-end de formation et d\'édification pour les jeunes. Thème: "Émergence d\'une génération de feu".',
                        event_date: '2026-06-27',
                        event_time: '09:00',
                        location: 'Auditorium de l\'Église',
                        type: 'Jeunesse'
                    },
                    {
                        id: 5,
                        title: 'Culte des Femmes',
                        description: 'Un moment spécial pour les femmes: prière, partage et encouragement mutuel.',
                        event_date: '2026-06-25',
                        event_time: '14:00',
                        location: 'Salle des Femmes',
                        type: 'Femmes'
                    },
                    // This event is from yesterday - will disappear after 1 day
                    {
                        id: 6,
                        title: 'Culte Spécial du Lundi',
                        description: 'Un culte spécial pour débuter la semaine dans la présence de Dieu.',
                        event_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday's date
                        event_time: '18:00',
                        location: 'Temple Central',
                        type: 'Culte'
                    },
                    // This event is from 2 days ago - should be hidden (more than 1 day passed)
                    {
                        id: 7,
                        title: 'Réunion des Anciens',
                        description: 'Réunion mensuelle des anciens de l\'église.',
                        event_date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
                        event_time: '09:00',
                        location: 'Salle de Conférence',
                        type: 'Conférence'
                    }
                ];
                
                // Apply visibility filter (events older than 1 day will be hidden)
                let visibleEvents = demoData.filter(event => isEventVisible(event.event_date));
                
                // Sort: upcoming events first (closest date first)
                visibleEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
                
                setEvents(demoData);
                setFilteredEvents(visibleEvents);
                setSpeakers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Filter events based on search and filters
    useEffect(() => {
        let filtered = events.filter(event => isEventVisible(event.event_date));
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
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
        
        // Sort by date (upcoming first - closest date to today)
        filtered.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
        
        setFilteredEvents(filtered);
    }, [searchTerm, selectedMonth, selectedEventType, events]);

    const formatDate = (dateString) => {
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

    if (loading) {
        return (
            <div className="events-loading">
                <div className="spinner"></div>
                <p>Chargement des événements...</p>
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
                                placeholder="Rechercher un événement..."
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
                                    <option value="all">Tous les mois</option>
                                    {getMonths().map((month, index) => (
                                        month !== 'all' && <option key={index} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Type d'événement</label>
                                <select value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)}>
                                    {eventTypes.map((type, index) => (
                                        <option key={index} value={type}>{type === 'all' ? 'Tous' : type}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Events List */}
            <section className="events-list-section">
                <div className="container">
                    {filteredEvents.length === 0 ? (
                        <div className="no-events">
                            <p>Aucun événement à venir pour le moment.</p>
                            <button onClick={() => { setSearchTerm(''); setSelectedMonth('all'); setSelectedEventType('all'); }}>
                                Voir tous les événements
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
                                                <button className="btn-add-calendar">
                                                    Ajouter au calendrier
                                                </button>
                                                <button className="btn-partager">
                                                    Partager
                                                </button>
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
                    <button className="btn-primary">Contacter l'équipe</button>
                </div>
            </section>
        </div>
    );
}

export default Events;