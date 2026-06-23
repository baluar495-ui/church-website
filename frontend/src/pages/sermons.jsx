import React, { useState, useEffect } from 'react';
import { FaPlay, FaCalendarAlt, FaMicrophone, FaSearch } from 'react-icons/fa';
import { sermonsAPI } from '../services/api';
import './Sermons.css';

function Sermons() {
    const [sermons, setSermons] = useState([]);
    const [filteredSermons, setFilteredSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpeaker, setSelectedSpeaker] = useState('all');
    const [speakers, setSpeakers] = useState([]);
    const [playingVideo, setPlayingVideo] = useState(null);

    useEffect(() => {
        const fetchSermons = async () => {
            try {
                const res = await sermonsAPI.getAll();
                const sermonsData = res.data.data || [];
                
                const updatedData = sermonsData.map(sermon => ({
                    id: sermon.id,
                    title: sermon.title,
                    speaker: sermon.speaker,
                    scripture: sermon.scripture,
                    description: sermon.description,
                    sermon_date: sermon.sermon_date,
                    videoUrl: sermon.video_url || 'https://www.youtube.com/embed/AVT74mxa944',
                    videoPlatform: 'youtube',
                    thumbnail: `https://img.youtube.com/vi/AVT74mxa944/hqdefault.jpg`
                }));
                
                setSermons(updatedData);
                setFilteredSermons(updatedData);
                const uniqueSpeakers = [...new Set(updatedData.map(s => s.speaker).filter(Boolean))];
                setSpeakers(uniqueSpeakers);
            } catch (error) {
                console.error('Error fetching sermons:', error);
                const demoData = [
                    {
                        id: 1,
                        title: 'Marchez dans la Foi, Non par la Vue',
                        speaker: 'Dr. Rév. Past. Batuvanwa Wilondja Imani Matabishi',
                        scripture: '2 Corinthiens 5:7',
                        description: 'Dans ce message puissant, le Pasteur nous invite à avancer dans la confiance totale en Dieu, même lorsque le chemin semble incertain. La foi n\'est pas l\'absence de doute, c\'est le choix de faire confiance malgré tout.',
                        sermon_date: '2025-06-08',
                        videoUrl: 'https://www.youtube.com/embed/AVT74mxa944',
                        videoPlatform: 'youtube',
                        thumbnail: 'https://img.youtube.com/vi/AVT74mxa944/hqdefault.jpg'
                    }
                ];
                setSermons(demoData);
                setFilteredSermons(demoData);
                setSpeakers(['Dr. Rév. Past. Batuvanwa Wilondja Imani Matabishi']);
            } finally {
                setLoading(false);
            }
        };
        fetchSermons();
    }, []);

    useEffect(() => {
        let filtered = sermons;
        if (searchTerm) {
            filtered = filtered.filter(sermon => 
                sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (sermon.speaker && sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (sermon.scripture && sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        if (selectedSpeaker !== 'all') {
            filtered = filtered.filter(sermon => sermon.speaker === selectedSpeaker);
        }
        setFilteredSermons(filtered);
    }, [searchTerm, selectedSpeaker, sermons]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Date inconnue';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    // Inline styles for the card to ensure proper layout
    const cardStyles = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 20px',
        },
        card: {
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #F1F0EC',
            marginBottom: '40px',
        },
        videoWrapper: {
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            background: '#1a1a1a',
            cursor: 'pointer',
            overflow: 'hidden',
        },
        thumbnail: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        playButton: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '72px',
            height: '72px',
            background: 'rgba(0,0,0,0.7)',
            border: '2px solid #FFD700',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFD700',
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            paddingLeft: '6px',
            zIndex: 2,
            border: 'none',
        },
        iframe: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
        },
        content: {
            padding: '32px',
        },
        meta: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
        },
        date: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#9CA3AF',
        },
        dateIcon: {
            color: '#FFD700',
            fontSize: '13px',
        },
        scripture: {
            fontSize: '12px',
            fontWeight: 600,
            color: '#1E3A8A',
            background: 'rgba(30,58,138,0.08)',
            padding: '4px 12px',
            borderRadius: '20px',
        },
        title: {
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '26px',
            fontWeight: 700,
            color: '#1E3A8A',
            lineHeight: 1.3,
            margin: '0 0 12px',
        },
        speaker: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '16px',
        },
        speakerIcon: {
            color: '#FFD700',
            fontSize: '13px',
        },
        description: {
            fontSize: '15px',
            lineHeight: 1.8,
            color: '#4B5563',
            margin: 0,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
        },
        loading: {
            textAlign: 'center',
            padding: '100px 20px',
            background: 'white',
        },
        spinner: {
            width: '50px',
            height: '50px',
            border: '3px solid #F1F0EC',
            borderTopColor: '#FFD700',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
        },
        noResults: {
            textAlign: 'center',
            padding: '60px 20px',
        },
        noResultsButton: {
            background: '#FFD700',
            color: '#1E3A8A',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '20px',
        },
    };

    if (loading) {
        return (
            <div style={cardStyles.loading}>
                <div style={cardStyles.spinner}></div>
                <p>Chargement des prédications...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="sermons-page">
            {/* Hero Section */}
            <section className="sermons-hero">
                <div className="sermons-hero-overlay"></div>
                <div className="sermons-hero-content">
                    <h1>Prédications</h1>
                    <p>Regardez et écoutez nos messages pour grandir dans votre foi</p>
                </div>
            </section>

            {/* Filters */}
            <section className="filters-section">
                <div className="container">
                    <div className="filters-wrapper">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Rechercher une prédication..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-speaker">
                            <select
                                value={selectedSpeaker}
                                onChange={(e) => setSelectedSpeaker(e.target.value)}
                            >
                                <option value="all">Tous les prédicateurs</option>
                                {speakers.map((speaker, index) => (
                                    <option key={index} value={speaker}>{speaker}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sermons List */}
            <section className="sermons-list-section">
                <div style={cardStyles.container}>
                    {filteredSermons.length === 0 ? (
                        <div style={cardStyles.noResults}>
                            <p>Aucune prédication trouvée.</p>
                            <button 
                                onClick={() => { setSearchTerm(''); setSelectedSpeaker('all'); }}
                                style={cardStyles.noResultsButton}
                            >
                                Voir toutes les prédications
                            </button>
                        </div>
                    ) : (
                        filteredSermons.map((sermon) => (
                            <div key={sermon.id} style={cardStyles.card}>
                                {/* Video Section */}
                                <div style={cardStyles.videoWrapper}>
                                    {playingVideo === sermon.id ? (
                                        <iframe
                                            src={sermon.videoUrl}
                                            style={cardStyles.iframe}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={sermon.title}
                                        />
                                    ) : (
                                        <>
                                            <img 
                                                src={sermon.thumbnail} 
                                                alt={sermon.title}
                                                style={cardStyles.thumbnail}
                                            />
                                            <button 
                                                style={cardStyles.playButton}
                                                onClick={() => setPlayingVideo(sermon.id)}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#FFD700';
                                                    e.currentTarget.style.color = '#1E3A8A';
                                                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                                                    e.currentTarget.style.color = '#FFD700';
                                                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                                                }}
                                            >
                                                <FaPlay />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={cardStyles.content}>
                                    <div style={cardStyles.meta}>
                                        <span style={cardStyles.date}>
                                            <FaCalendarAlt style={cardStyles.dateIcon} />
                                            {formatDate(sermon.sermon_date)}
                                        </span>
                                        {sermon.scripture && (
                                            <span style={cardStyles.scripture}>
                                                📖 {sermon.scripture}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h3 style={cardStyles.title}>{sermon.title}</h3>
                                    
                                    <div style={cardStyles.speaker}>
                                        <FaMicrophone style={cardStyles.speakerIcon} />
                                        <span>{sermon.speaker || 'Prédicateur'}</span>
                                    </div>
                                    
                                    <p style={cardStyles.description}>{sermon.description || 'Aucune description disponible.'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default Sermons;