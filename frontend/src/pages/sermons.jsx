import React, { useState, useEffect } from 'react';
import { FaPlay, FaCalendarAlt, FaMicrophone, FaSearch, FaYoutube, FaFacebook } from 'react-icons/fa';
import { sermonsAPI } from '../services/api';

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
                setSermons(sermonsData);
                setFilteredSermons(sermonsData);
                const uniqueSpeakers = [...new Set(sermonsData.map(s => s.speaker).filter(Boolean))];
                setSpeakers(uniqueSpeakers);
            } catch (error) {
                console.error('Error fetching sermons:', error);
                const demoData = [
                    {
                        id: 1,
                        title: 'Marchez dans la Foi, Non par la Vue',
                        speaker: 'Dr. Rév. Past. Batuvanwa Wilondja Imani Matabishi',
                        scripture: '2 Corinthiens 5:7',
                        description: 'Dans ce message puissant, le Pasteur nous invite à avancer dans la confiance totale en Dieu, même lorsque le chemin semble incertain. La foi nest pas l absence de doute, c est le choix de faire confiance malgré tout.',
                        sermon_date: '2025-06-08',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        videoPlatform: 'youtube',
                        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
                    },
                    {
                        id: 2,
                        title: 'La Puissance de la Prière',
                        speaker: 'Pasteur Justin Muziko',
                        scripture: 'Matthieu 6:5-15',
                        description: 'Découvrez comment la prière peut transformer votre vie et votre relation avec Dieu. Apprenez à prier avec foi et persévérance.',
                        sermon_date: '2025-06-01',
                        videoUrl: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/10153231379946729/',
                        videoPlatform: 'facebook',
                        thumbnail: 'https://images.unsplash.com/photo-1545179068-9f8b5e8850bf?w=400'
                    },
                    {
                        id: 3,
                        title: 'L\'Amour de Dieu',
                        speaker: 'Pasteur Mwililikwa',
                        scripture: 'Jean 3:16',
                        description: 'Un message sur l amour inconditionnel de Dieu pour l humanité. Dieu nous a tant aimés qu Il a donné Son Fils unique pour nous sauver.',
                        sermon_date: '2025-05-25',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        videoPlatform: 'youtube',
                        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
                    },
                ];
                setSermons(demoData);
                setFilteredSermons(demoData);
                setSpeakers(['Dr. Rév. Past. Batuvanwa Wilondja Imani Matabishi', 'Pasteur Justin Muziko', 'Pasteur Mwililikwa']);
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
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const getVideoEmbedUrl = (url, platform) => {
        if (platform === 'youtube') {
            return url;
        }
        return url;
    };

    const styles = {
        page: {
            fontFamily: "'Inter', sans-serif",
            background: 'white',
            minHeight: '100vh',
        },
        hero: {
            position: 'relative',
            minHeight: '40vh',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0F2057 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        },
        heroContent: {
            position: 'relative',
            zIndex: 2,
            padding: '80px 20px',
        },
        heroTitle: {
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '56px',
            fontWeight: 800,
            color: '#FFD700',
            margin: '0 0 16px',
        },
        heroSubtitle: {
            fontSize: '18px',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '600px',
            margin: '0 auto',
        },
        filtersSection: {
            padding: '40px',
            background: '#F8F7F4',
            borderBottom: '1px solid #E5E4E7',
        },
        filtersWrapper: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            maxWidth: '1160px',
            margin: '0 auto',
        },
        searchBox: {
            flex: 1,
            maxWidth: '400px',
            position: 'relative',
        },
        searchInput: {
            width: '100%',
            padding: '14px 16px 14px 44px',
            border: '1px solid #E5E4E7',
            borderRadius: '12px',
            fontSize: '14px',
        },
        select: {
            padding: '14px 20px',
            border: '1px solid #E5E4E7',
            borderRadius: '12px',
            fontSize: '14px',
            minWidth: '220px',
            background: 'white',
            cursor: 'pointer',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '32px',
            maxWidth: '1160px',
            margin: '0 auto',
            padding: '60px 40px',
        },
        card: {
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #F1F0EC',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            transition: 'transform 0.3s ease',
        },
        videoContainer: {
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            backgroundColor: '#1a1a1a',
            cursor: 'pointer',
        },
        videoThumbnail: {
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
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFD700',
            fontSize: '24px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
        },
        videoIframe: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
        },
        cardContent: {
            padding: '24px',
        },
        cardHeader: {
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
            gap: '6px',
            fontSize: '12px',
            color: '#9CA3AF',
        },
        scripture: {
            fontSize: '11px',
            fontWeight: 600,
            color: '#1E3A8A',
            background: 'rgba(30,58,138,0.08)',
            padding: '4px 10px',
            borderRadius: '20px',
        },
        title: {
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '20px',
            fontWeight: 700,
            color: '#1E3A8A',
            margin: '0 0 12px',
            lineHeight: 1.3,
        },
        speaker: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#6B7280',
            marginBottom: '16px',
        },
        description: {
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#4B5563',
            marginBottom: '20px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
        },
        platformIcon: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: '#9CA3AF',
            marginTop: '12px',
        },
        loading: {
            textAlign: 'center',
            padding: '60px 20px',
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
            <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Chargement des prédications...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Prédications</h1>
                    <p style={styles.heroSubtitle}>Regardez et écoutez nos messages pour grandir dans votre foi</p>
                </div>
            </div>

            {/* Filters */}
            <div style={styles.filtersSection}>
                <div style={styles.filtersWrapper}>
                    <div style={styles.searchBox}>
                        <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Rechercher une prédication..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>
                    <div>
                        <select
                            value={selectedSpeaker}
                            onChange={(e) => setSelectedSpeaker(e.target.value)}
                            style={styles.select}
                        >
                            <option value="all">Tous les prédicateurs</option>
                            {speakers.map((speaker, index) => (
                                <option key={index} value={speaker}>{speaker}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Sermons Grid */}
            <div style={styles.grid}>
                {filteredSermons.length === 0 ? (
                    <div style={styles.noResults}>
                        <p>Aucune prédication trouvée.</p>
                        <button 
                            onClick={() => { setSearchTerm(''); setSelectedSpeaker('all'); }}
                            style={styles.noResultsButton}
                        >
                            Voir toutes les prédications
                        </button>
                    </div>
                ) : (
                    filteredSermons.map((sermon) => (
                        <div key={sermon.id} style={styles.card}>
                            {/* Video Section */}
                            <div style={styles.videoContainer}>
                                {playingVideo === sermon.id ? (
                                    <iframe
                                        src={getVideoEmbedUrl(sermon.videoUrl, sermon.videoPlatform)}
                                        style={styles.videoIframe}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={sermon.title}
                                    />
                                ) : (
                                    <>
                                        <img 
                                            src={sermon.thumbnail} 
                                            alt={sermon.title}
                                            style={styles.videoThumbnail}
                                        />
                                        <div 
                                            style={styles.playButton}
                                            onClick={() => setPlayingVideo(sermon.id)}
                                        >
                                            <FaPlay />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Card Content */}
                            <div style={styles.cardContent}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.date}>
                                        <FaCalendarAlt />
                                        <span>{formatDate(sermon.sermon_date)}</span>
                                    </div>
                                    {sermon.scripture && (
                                        <div style={styles.scripture}>
                                            📖 {sermon.scripture}
                                        </div>
                                    )}
                                </div>
                                
                                <h3 style={styles.title}>{sermon.title}</h3>
                                
                                <div style={styles.speaker}>
                                    <FaMicrophone />
                                    <span>{sermon.speaker || 'Prédicateur'}</span>
                                </div>
                                
                                <p style={styles.description}>{sermon.description || 'Aucune description disponible.'}</p>
                                
                                <div style={styles.platformIcon}>
                                    {sermon.videoPlatform === 'youtube' ? (
                                        <><FaYoutube color="#FF0000" /> YouTube</>
                                    ) : (
                                        <><FaFacebook color="#1877F2" /> Facebook</>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Sermons;