import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
    FaPlay, FaCalendarAlt, FaMapMarkerAlt, FaUserFriends,
    FaHandsHelping, FaHeart, FaBible, FaChild, FaStar,
    FaBook, FaFire, FaFemale, FaPray, FaChurch, FaClock,
    FaChevronLeft, FaChevronRight, FaMicrophone, FaHeadphones, FaDoorOpen, FaHands
} from 'react-icons/fa';
import { eventsAPI, leadershipAPI } from '../services/api';
import './Home.css';

// ============================================
// LOCAL IMAGE IMPORTS
// ============================================
// Hero Slider Images
import heroSlide1 from '../assets/images/Hero1.jpg';
import heroSlide2 from '../assets/images/Hero2.jpg';
import heroSlide3 from '../assets/images/Hero3.jpg';

// Section Images
import servicesImage from '../assets/images/Hero1.jpg';
import welcomeImage from '../assets/images/Hero2.jpg';
import sundaySchoolImage from '../assets/images/SundaySchool1.jpg';
import youthLeaderImage from '../assets/images/YouthChairperson.jpg';
import ladiesMainImage from '../assets/images/Ladies Chairperson.jpg';
import worshipTeamImage from '../assets/images/Praise and Worship Team.jpg';

// Choir Images
import choirMessagers from '../assets/images/Messenger Choir.jpg';
import choirUjasiri from '../assets/images/Ladies.jpg';
import choirUfunuo from '../assets/images/Ufunuochoir.jpg';
import choirSmyrna from '../assets/images/Hero1.jpg';

// Leadership Images (keep these for fallback)
import pastorImage from '../assets/images/Lead pastor.jpg';
import pastorImage1 from '../assets/images/Justin.jpg';
import pastorImage2 from '../assets/images/Nguzo.jpg';
import pastorImage3 from '../assets/images/Pastor Pierre.jpg';
import pastorImage4 from '../assets/images/Bonheur.jpg';
import pastorImage5 from '../assets/images/Mwililikwa.jpg';
import pastorImage6 from '../assets/images/Ilundu.jpg';
import pastorImage7 from '../assets/images/Wasolu.jpg';

// ============================================
// PHOTO STRIP IMAGES
// ============================================
import sundaySchoolPhoto1 from '../assets/images/SundaySchool5.jpg';
import sundaySchoolPhoto2 from '../assets/images/Sunday 3.jpg';
import sundaySchoolPhoto3 from '../assets/images/sunday4.jpg';
import youthPhoto1 from '../assets/images/Youth.jpg';
import youthPhoto2 from '../assets/images/Youth2.jpg';
import youthPhoto3 from '../assets/images/Youth1.jpg';
import ladiesPhoto1 from '../assets/images/Ladies1.jpg';
import ladiesPhoto2 from '../assets/images/Ladies.jpg';
import ladiesPhoto3 from '../assets/images/Ladies Chairperson.jpg';

// ============================================
// LEADERSHIP IMAGE MAPPING (Option 2)
// ============================================
const leadershipImageMap = {
    '/images/Lead pastor.jpg': pastorImage,
    '/images/Justin.jpg': pastorImage1,
    '/images/Nguzo.jpg': pastorImage2,
    '/images/Pastor Pierre.jpg': pastorImage3,
    '/images/Bonheur.jpg': pastorImage4,
    '/images/Mwililikwa.jpg': pastorImage5,
    '/images/Ilundu.jpg': pastorImage6,
    '/images/Wasolu.jpg': pastorImage7,
    // Alternative paths if the database uses different naming
    '/images/Mwililikwa.JPG': pastorImage5,
    '/images/Ilundu.JPG': pastorImage6,
    '/images/Wasolu.JPG': pastorImage7,
};

/* ── Animated counter ── */
function AnimatedCounter({ target, suffix = '', duration = 2 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const motionVal = useMotionValue(0);
    const springVal = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
    const [display, setDisplay] = useState(0);
    useEffect(() => { if (isInView) motionVal.set(target); }, [isInView, target, motionVal]);
    useEffect(() => springVal.on('change', v => setDisplay(Math.round(v))), [springVal]);
    return <span ref={ref}>{display}{suffix}</span>;
}

function Home() {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [leadershipTeam, setLeadershipTeam] = useState([]);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false); // <-- ADD THIS

    const heroSlides = [
        {
            image: heroSlide1,
            title: 'Bienvenue à la 8ème CEPAC PENUEL SWAHILOPHONE',
            subtitle: 'Une Église Familiale, Dynamique et Missionnaire',
        },
        {
            image: heroSlide2,
            title: 'Adorez Dieu en Esprit et en Vérité',
            subtitle: 'Rejoignez-nous chaque Dimanche pour un culte puissant',
        },
        {
            image: heroSlide3,
            title: 'Ensemble, Nous Faisons la Différence',
            subtitle: "Une communauté unie par la foi, l'espérance et l'amour",
        },
    ];

    useEffect(() => {
        const t = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5000);
        return () => clearInterval(t);
    }, [heroSlides.length]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await eventsAPI.getUpcoming();
                setUpcomingEvents(res.data.data || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchEvents();
    }, []);

    // Fetch leadership from API
    useEffect(() => {
        const fetchLeadership = async () => {
            try {
                const res = await leadershipAPI.getAll();
                setLeadershipTeam(res.data.data || []);
            } catch (error) {
                console.error('Error fetching leadership:', error);
                // Fallback hardcoded data with correct image_url
                setLeadershipTeam([
                    {
                        name: 'Dr. Rév. Past. Batuvanwa Wilondja Imani Matabishi',
                        role: 'Pasteur Principal',
                        image_url: '/images/Lead pastor.jpg',
                        highlight: true,
                    },
                    { name: 'Pasteur Justin Muziko', role: 'Ancien - Comptable', image_url: '/images/Justin.jpg' },
                    { name: 'Pasteur Mwililikwa', role: 'Ancien - Cassier', image_url: '/images/Mwililikwa.jpg' },
                    { name: 'Pasteur Nguzo Philippe', role: 'Ancien - Enseignement et vie de l\'Église', image_url: '/images/Nguzo.jpg' },
                    { name: 'Pasteur Pierre Mukamba', role: 'Ancien - Enseignement et vie de l\'Église', image_url: '/images/Pastor Pierre.jpg' },
                    { name: 'Pasteur Ilundu Bulambo', role: 'Ancien - [Département]', image_url: '/images/Ilundu.jpg' },
                    { name: 'Pasteur Wasolu', role: 'Ancien - [Département]', image_url: '/images/Wasolu.jpg' },
                    { name: 'Pasteur Kalala', role: 'Ancien - [Département]', image_url: null },
                    { name: 'Pasteur Bonheur', role: 'Ancien - Comité de musique', image_url: '/images/Bonheur.jpg' },
                ]);
            }
        };
        fetchLeadership();
    }, []);

    /* ── UPDATED WEEKLY SCHEDULE ── */
    const weeklySchedule = [
        { day: 'Lundi',     time: '16h00',         label: 'Étude Biblique — Jeunes',     color: 'navy' },
        { day: 'Mar–Jeu',   time: '16h00 – 18h00', label: 'Culte en Semaine',            color: 'navy' },
        { day: 'Mercredi',  time: '7h30 – 9h00',   label: 'Culte Mamans Adultes',        color: 'rose' },
        { day: 'Vendredi',  time: '7h00 – 8h00',   label: 'Enseignement aux Veuves',     color: 'rose' },
        { day: 'Vendredi',  time: '8h00 – 11h00',  label: 'Prière & Intercession',       color: 'rose' },
        { day: 'Samedi',    time: '15h00',          label: 'Prière des Serviteurs',       color: 'navy' },
        { day: 'Dimanche',  time: '8h30 – 10h30',  label: '1er Culte — Swahili',         color: 'gold' },
        { day: 'Dimanche',  time: '10h30 – 12h30', label: '2ème Culte — Bilingue',       color: 'gold' },
        { day: 'Dimanche',  time: '12h30 – 14h30', label: 'Enseignement des Jeunes',     color: 'gold' },
    ];

    const stats = [
        { value: 25,  suffix: '+', label: 'Années de Ministère', icon: <FaChurch /> },
        { value: 300, suffix: '+', label: 'Familles Servies',    icon: <FaUserFriends /> },
        { value: 9,   suffix: '',  label: 'Cultes par Semaine',  icon: <FaBible /> },
        { value: 5,   suffix: '',  label: 'Ministères Actifs',   icon: <FaHandsHelping /> },
    ];

    /* ── PHOTO STRIPS ── */
    const sundaySchoolPhotos = [sundaySchoolPhoto1, sundaySchoolPhoto2, sundaySchoolPhoto3];
    const youthPhotos = [youthPhoto1, youthPhoto2, youthPhoto3];
    const ladiesPhotos = [ladiesPhoto1, ladiesPhoto2, ladiesPhoto3];

    // Sunday School Carousel state
    const [ssCurrentIndex, setSsCurrentIndex] = useState(0);
    const ssTotalImages = sundaySchoolPhotos.length;
    const ssVisibleItems = 3;
    const ssMaxIndex = Math.max(0, ssTotalImages - ssVisibleItems);

    const ssNextImage = () => {
        setSsCurrentIndex((prev) => Math.min(prev + 1, ssMaxIndex));
    };

    const ssPrevImage = () => {
        setSsCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    // Youth Carousel state
    const [youthCurrentIndex, setYouthCurrentIndex] = useState(0);
    const youthTotalImages = youthPhotos.length;
    const youthVisibleItems = 3;
    const youthMaxIndex = Math.max(0, youthTotalImages - youthVisibleItems);

    const youthNextImage = () => {
        setYouthCurrentIndex((prev) => Math.min(prev + 1, youthMaxIndex));
    };

    const youthPrevImage = () => {
        setYouthCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    // Ladies Carousel state
    const [ladiesCurrentIndex, setLadiesCurrentIndex] = useState(0);
    const ladiesTotalImages = ladiesPhotos.length;
    const ladiesVisibleItems = 3;
    const ladiesMaxIndex = Math.max(0, ladiesTotalImages - ladiesVisibleItems);

    const ladiesNextImage = () => {
        setLadiesCurrentIndex((prev) => Math.min(prev + 1, ladiesMaxIndex));
    };

    const ladiesPrevImage = () => {
        setLadiesCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    /* ── LATEST SERMON ── */
    const latestSermon = {
        title: '7 Secrets d\'une Prière Exaucée',
        speaker: 'Dr. Rév. Past. Batuvanwa Wilondja Imani Matabishi',
        date: '30 Septembre 2021',
        series: 'Série : Vivre par la Foi',
        duration: '34 min',
        thumbnail: heroSlide1,
        videoUrl: 'https://www.youtube.com/embed/AVT74mxa944'
    };

    // Helper function to get the correct image
    const getLeadershipImage = (person) => {
        if (!person.image_url) return null;
        // Try exact match first, then fallback to case-insensitive search
        const exactMatch = leadershipImageMap[person.image_url];
        if (exactMatch) return exactMatch;
        
        // Case-insensitive fallback
        const lowerKey = person.image_url.toLowerCase();
        const matchedKey = Object.keys(leadershipImageMap).find(key => key.toLowerCase() === lowerKey);
        return matchedKey ? leadershipImageMap[matchedKey] : null;
    };
    return (
        <div className="home">

            {/* ══ HERO ══ */}
            <section className="hero-section">
                {heroSlides.map((slide, i) => (
                    <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }} />
                ))}
                <div className="hero-overlay" />
                <div className="hero-content">
                    <motion.div key={currentSlide} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }} className="hero-text">
                        <span className="hero-tag">8ÈME CEPAC PENUEL SWAHILOPHONE</span>
                        <h1>{heroSlides[currentSlide].title}</h1>
                        <p>{heroSlides[currentSlide].subtitle}</p>
                        <div className="hero-buttons">
                            <button className="btn-primary">Planifiez Votre Visite</button>
                            <button className="btn-outline"><FaPlay style={{ marginRight: 8 }} /> Regarder en Direct</button>
                        </div>
                    </motion.div>
                </div>
                <button className="hero-arrow hero-arrow--left" onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}><FaChevronLeft /></button>
                <button className="hero-arrow hero-arrow--right" onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}><FaChevronRight /></button>
                <div className="slide-indicators">
                    {heroSlides.map((_, i) => (
                        <button key={i} className={`indicator ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
                    ))}
                </div>
            </section>

            {/* ══ SERVICE TIMES BAR ══ */}
            <div className="service-bar">
                <div className="service-bar-inner">
                    <div className="service-bar-item"><span className="service-bar-label">1er Culte — Dimanche</span><span className="service-bar-time">8h30 – 10h30</span></div>
                    <div className="service-bar-divider">•</div>
                    <div className="service-bar-item"><span className="service-bar-label">2ème Culte — Dimanche</span><span className="service-bar-time">10h30 – 12h30</span></div>
                    <div className="service-bar-divider">•</div>
                    <div className="service-bar-item"><span className="service-bar-label">Cultes en Semaine</span><span className="service-bar-time">Mar–Jeu 16h00</span></div>
                    <div className="service-bar-divider">•</div>
                    <div className="service-bar-item"><span className="service-bar-label">Ministère des Femmes</span><span className="service-bar-time">Mer & Ven</span></div>
                </div>
            </div>

            {/* ══ NOS CULTES ══ */}
            <section className="services-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="services-grid">
                        <div className="services-content">
                            <span className="section-tag">Horaires</span>
                            <h2>Nos Cultes</h2>
                            <p>Rejoignez-nous pour des moments puissants de louange et d'adoration tout au long de la semaine.</p>
                            <div className="schedule-grid">
                                {weeklySchedule.map((item, idx) => (
                                    <div key={idx} className={`schedule-card schedule-card--${item.color}`}>
                                        <div className="schedule-card-day">{item.day}</div>
                                        <div className="schedule-card-body">
                                            <span className="schedule-card-label">{item.label}</span>
                                            <span className="schedule-card-time"><FaClock className="schedule-clock" />{item.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="services-image">
                            <img src={servicesImage} alt="Culte" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══ BIENVENUE + LEADERSHIP ══ */}
            <section className="welcome-section">
                {/* Welcome intro - REDESIGNED LIKE SERMON CARD */}
<motion.div 
    initial={{ opacity: 0, y: 30 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.6 }} 
    className="welcome-card"
>
    <div className="welcome-card-image">
        <img src={welcomeImage} alt="Famille" />
    </div>
    <div className="welcome-card-content">
        <span className="section-tag">Notre Communauté</span>
        <h2>Bienvenue à Notre Famille</h2>
        <p className="welcome-body">
            Vous êtes chez vous ici. Peu importe votre histoire ou votre parcours — il y a une place pour vous dans notre communauté. Nous sommes une famille de croyants réunis par la foi en Jésus-Christ, déterminés à grandir ensemble, à servir et à rayonner l'amour de Dieu.
        </p>
        <p className="welcome-body">
            Chaque dimanche, nous nous retrouvons pour adorer, écouter la Parole et nous encourager mutuellement. Que vous veniez pour la première fois ou que vous cherchiez une maison spirituelle, nous vous accueillons à bras ouverts.
        </p>
        <div className="welcome-features-grid">
            {[
                { icon: <FaHeart />, label: 'Accueil chaleureux', desc: 'Une équipe dédiée pour vous recevoir' },
                { icon: <FaBible />, label: 'Messages inspirants', desc: 'La Parole de Dieu enseignée avec clarté' },
                { icon: <FaUserFriends />, label: 'Communauté aimante', desc: 'Des liens authentiques pour grandir ensemble' },
            ].map((f, i) => (
                <div key={i} className="welcome-feature-item">
                    <div className="welcome-feature-icon">{f.icon}</div>
                    <div>
                        <strong>{f.label}</strong>
                        <p>{f.desc}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className="first-visit-grid">
    <div className="visit-item">
        <div className="visit-icon"><FaDoorOpen /></div>
        <div>
            <h4>Arrivée</h4>
            <p>Venez comme vous êtes — tenue correcte appréciée</p>
        </div>
    </div>
    <div className="visit-item">
        <div className="visit-icon"><FaHands /></div>
        <div>
            <h4>Accueil</h4>
            <p>Notre équipe vous reçoit dès l'entrée</p>
        </div>
    </div>
    <div className="visit-item">
        <div className="visit-icon"><FaChild /></div>
        <div>
            <h4>Enfants</h4>
            <p>École du Dimanche disponible pendant le culte</p>
        </div>
    </div>
    <div className="visit-item">
        <div className="visit-icon"><FaClock /></div>
        <div>
            <h4>Durée</h4>
            <p>Environ 2 heures de louange et Parole</p>
        </div>
    </div>
</div>
    </div>
</motion.div>
                {/* Leadership team */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="leadership-block">
                    <div className="leadership-header">
                        <span className="section-tag">Équipe</span>
                        <h2>Notre Leadership</h2>
                        <p>Des serviteurs de Dieu dévoués qui guident notre église avec sagesse et amour.</p>
                    </div>

                    {/* Pastor Principal */}
                    <div className="pastor-featured-card">
                        <div className="pastor-featured-img">
                            {leadershipTeam.length > 0 && leadershipTeam[0]?.image_url ? (
                                <img 
                                    src={getLeadershipImage(leadershipTeam[0]) || pastorImage} 
                                    alt={leadershipTeam[0].name} 
                                />
                            ) : (
                                <img src={pastorImage} alt="Pasteur Principal" />
                            )}
                        </div>
                        <div className="pastor-featured-content">
                            <span className="section-tag">Leadership</span>
                            <h3>{leadershipTeam.length > 0 ? leadershipTeam[0].name : 'Dr. Rév. Past. Batuvanwa Wilondja Imani Matabishi'}</h3>
                            <p className="pastor-role">{leadershipTeam.length > 0 ? leadershipTeam[0].role : 'Pasteur Principal'}</p>
                            <p className="pastor-bio-text">
                                Un homme de Dieu passionné par l'évangélisation et l'édification des familles, guidant notre église avec sagesse, humilité et un cœur de serviteur depuis de nombreuses années.
                            </p>
                            <div className="pastor-featured-quote">
                                <FaBible className="pastor-featured-quote-icon" />
                                <p>"L'Église n'est pas un bâtiment, c'est une famille de croyants unis par l'amour du Christ."</p>
                            </div>
                        </div>
                    </div>

                    {/* Elders & Deacons grid */}
                    <div className="elders-grid">
                        {leadershipTeam.length > 0 ? (
                            leadershipTeam.slice(1).map((person, i) => (
                                <motion.div key={i} className="elder-card"
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <div className="elder-img-wrap">
                                        {person.image_url && getLeadershipImage(person) ? (
                                            <img src={getLeadershipImage(person)} alt={person.name} />
                                        ) : (
                                            <div className="elder-placeholder"><FaUserFriends /></div>
                                        )}
                                    </div>
                                    <div className="elder-info">
                                        <h4>{person.name}</h4>
                                        <p>{person.role}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            // Fallback if leadershipTeam is empty
                            <>
                                <div className="elder-card">
                                    <div className="elder-img-wrap"><div className="elder-placeholder"><FaUserFriends /></div></div>
                                    <div className="elder-info"><h4>Chargement...</h4><p>Équipe</p></div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </section>

          {/* ══ LATEST SERMON - NEW VERSION ══ */}
<section className="sermon-section home-sermon-new">
    <div className="container">
        <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
        >
            {/* Header */}
            <div className="sermon-header-new">
                <span className="section-tag">Prédications</span>
                <h2>Dernière Prédication</h2>
            </div>

            {/* Main Card - New Layout */}
            <div className="sermon-card-new">
                {/* LEFT: Video with custom play button */}
<div className="sermon-video-new">
    <div className="video-wrapper-new">
        {isVideoPlaying ? (
            <iframe 
                src={`${latestSermon.videoUrl}?autoplay=1`}
                title={latestSermon.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        ) : (
            <>
                <img 
                    src="https://img.youtube.com/vi/AVT74mxa944/maxresdefault.jpg" 
                    alt={latestSermon.title}
                    className="video-thumbnail-new"
                />
                <button 
                    className="custom-play-btn-new"
                    onClick={() => setIsVideoPlaying(true)}
                >
                    <FaPlay className="play-icon-new" />
                </button>
            </>
        )}
    </div>
    <div className="video-duration-new">
        <FaHeadphones style={{ marginRight: 6 }} />
        {latestSermon.duration}
    </div>
</div>

                {/* Right: Content */}
                <div className="sermon-content-new">
                    <div className="series-tag-new">{latestSermon.series}</div>
                    <h3 className="sermon-title-new">{latestSermon.title}</h3>
                    
                    {/* Speaker - Clean alignment */}
                    <div className="sermon-speaker-new">
                        <FaMicrophone className="speaker-icon-new" />
                        <span>{latestSermon.speaker}</span>
                    </div>
                    
                    {/* Date - Clean alignment */}
                    <div className="sermon-date-new">
                        <FaCalendarAlt className="date-icon-new" />
                        <span>{latestSermon.date}</span>
                    </div>
                    
                    <p className="sermon-description-new">
                        Dans ce message puissant, le Pasteur nous invite à avancer dans la confiance totale en Dieu, même lorsque le chemin semble incertain. La foi n'est pas l'absence de doute — c'est le choix de faire confiance malgré tout.
                    </p>
                    
                    <div className="sermon-buttons-new">
                        <button 
                            className="btn-listen-new"
                            onClick={() => setIsVideoPlaying(true)}
                        >
                            <FaPlay style={{ marginRight: 8 }} />
                            Écouter Maintenant
                        </button>
                        <a href="/sermons" className="btn-all-new">Toutes les Prédications →</a>
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
</section>
            {/* ══ ÉCOLE DU DIMANCHE ══ */}
            <section className="sunday-school-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="sunday-school-grid">
                        <div className="sunday-school-content">
                            <span className="section-tag">Enfants & Jeunesse</span>
                            <h2>École du Dimanche</h2>
                            <p className="sunday-school-mission">
                                "Servir le Seigneur Jésus-Christ en enseignant les vérités de Sa Parole et en préparant les enfants pour la vie dans ce monde et la vie au ciel."
                            </p>
                            <div className="program-title"><FaBook className="program-title-icon" /><span>Programme du Dimanche</span></div>
                            <div className="program-list">
                                <div className="program-item">
                                    <div className="program-time-badge">7h00 – 8h00</div>
                                    <div className="program-item-info">
                                        <span className="program-item-label">1ère Session</span>
                                        <span className="program-item-desc">Enseignement biblique, chants et prière pour enfants</span>
                                    </div>
                                </div>
                                <div className="program-item">
                                    <div className="program-time-badge">8h00 – 9h30</div>
                                    <div className="program-item-info">
                                        <span className="program-item-label">2ème Session</span>
                                        <span className="program-item-desc">Étude approfondie de la Parole et activités créatives</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sunday-school-values">
                                <div className="ss-value"><FaBible className="ss-value-icon" /><span>Enseignement Biblique</span></div>
                                <div className="ss-value"><FaChild className="ss-value-icon" /><span>Développement Spirituel</span></div>
                                <div className="ss-value"><FaStar className="ss-value-icon" /><span>Formation du Caractère</span></div>
                            </div>
                        </div>
                        <div className="sunday-school-image">
                            <img src={sundaySchoolImage} alt="École du Dimanche" />
                            <div className="ss-image-badge"><span className="ss-badge-number">2</span><span className="ss-badge-label">Sessions chaque Dimanche</span></div>
                        </div>
                    </motion.div>
                    
                    {/* Sunday School Carousel - 3 images visible at a time */}
                    <div className="ministry-photo-carousel">
                        <button 
                            className="carousel-arrow carousel-arrow--left" 
                            onClick={ssPrevImage}
                            disabled={ssCurrentIndex === 0}
                        >
                            <FaChevronLeft />
                        </button>
                        
                        <div className="carousel-track-container">
                            <div 
                                className="carousel-track"
                                style={{ transform: `translateX(-${ssCurrentIndex * (100 / 3)}%)` }}
                            >
                                {sundaySchoolPhotos.map((src, i) => (
                                    <div key={i} className="carousel-slide">
                                        <img src={src} alt={`École du Dimanche ${i + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <button 
                            className="carousel-arrow carousel-arrow--right" 
                            onClick={ssNextImage}
                            disabled={ssCurrentIndex === ssMaxIndex}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ JEUNESSE ══ */}
            <section className="youth-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="youth-grid">
                        <div className="youth-leader-col">
                            <div className="youth-leader-card">
                                <div className="youth-leader-img-wrap">
                                    <img src={youthLeaderImage} alt="Présidente" />
                                </div>
                                <div className="youth-leader-info">
                                    <h3>Rachel Mwati</h3>
                                    <p>Présidente — Ministère de la Jeunesse</p>
                                    <div className="youth-leader-quote">
                                        <FaFire className="youth-quote-icon" />
                                        <span>"La jeunesse en feu pour Dieu change le monde."</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="youth-content">
                            <span className="section-tag youth-tag">Jeunesse</span>
                            <h2>Ministère de la Jeunesse</h2>
                            <p className="youth-mission">
                                "Offrir une identité aux jeunes en modelant une relation vibrante avec Dieu à travers un enseignement et une formation ancrés dans des principes solides, pour une vie épanouie dans toutes ses dimensions."
                            </p>
                            <div className="program-title youth-program-title"><FaFire className="program-title-icon" /><span>Activités & Programme</span></div>
                            <div className="youth-activities">
                                {[
                                    { icon: <FaBible />, title: 'Étude de la Parole', desc: 'Enseignement biblique adapté aux réalités de la jeunesse' },
                                    { icon: <FaUserFriends />, title: 'Fraternité & Communauté', desc: 'Rassemblements, retraites et activités de groupe' },
                                    { icon: <FaHandsHelping />, title: 'Service & Évangélisation', desc: 'Actions communautaires et témoignage dans la ville' },
                                    { icon: <FaStar />, title: 'Formation & Leadership', desc: 'Développement des dons et formation de futurs leaders' },
                                ].map((a, i) => (
                                    <div key={i} className="youth-activity-card">
                                        <span className="ya-icon">{a.icon}</span>
                                        <div><strong>{a.title}</strong><p>{a.desc}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Youth Carousel - 3 images visible at a time */}
                    <div className="ministry-photo-carousel">
                        <button 
                            className="carousel-arrow carousel-arrow--left" 
                            onClick={youthPrevImage}
                            disabled={youthCurrentIndex === 0}
                        >
                            <FaChevronLeft />
                        </button>
                        
                        <div className="carousel-track-container">
                            <div 
                                className="carousel-track"
                                style={{ transform: `translateX(-${youthCurrentIndex * (100 / 3)}%)` }}
                            >
                                {youthPhotos.map((src, i) => (
                                    <div key={i} className="carousel-slide">
                                        <img src={src} alt={`Jeunesse ${i + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <button 
                            className="carousel-arrow carousel-arrow--right" 
                            onClick={youthNextImage}
                            disabled={youthCurrentIndex === youthMaxIndex}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ LADIES ══ */}
            <section className="ladies-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="ladies-grid">
                        <div className="ladies-image-col">
                            <div className="ladies-img-wrap">
                                <img src={ladiesMainImage} alt="Ministère des Femmes" />
                            </div>
                            <div className="ladies-stat-cards">
                                {[{ icon: <FaHeart />, label: 'Sœurs Unies' }, { icon: <FaPray />, label: 'Prière & Louange' }, { icon: <FaHandsHelping />, label: 'Service Communautaire' }].map((s, i) => (
                                    <div key={i} className="ladies-stat"><span className="ladies-stat-icon">{s.icon}</span><span>{s.label}</span></div>
                                ))}
                            </div>
                        </div>
                        <div className="ladies-content">
                            <span className="section-tag ladies-tag">Femmes</span>
                            <h2>Ministère des Femmes</h2>
                            <p className="ladies-mission">
                                "Glorifier Dieu par l'étude de Sa Parole, soutenir la vision du Pasteur, collaborer avec les autres ministères de l'Église, témoigner de notre amour mutuel et étendre notre portée vers les femmes au-delà des murs de l'église."
                            </p>
                            <div className="program-title ladies-program-title"><FaFemale className="program-title-icon" /><span>Programme Hebdomadaire</span></div>
                            <div className="ladies-program-grid">
                                <div className="ladies-program-card">
                                    <div className="ladies-program-header"><span className="ladies-day-badge ladies-day-badge--mercredi">Mercredi</span></div>
                                    <div className="ladies-program-body">
                                        <h4>Culte Mamans Adultes</h4>
                                        <div className="ladies-program-time"><FaClock className="ladies-clock" /><span>7h30 – 9h00</span></div>
                                        <p>Moment de prière, d'adoration et d'édification pour les mamans de notre communauté.</p>
                                    </div>
                                </div>
                                <div className="ladies-program-card">
                                    <div className="ladies-program-header"><span className="ladies-day-badge ladies-day-badge--vendredi">Vendredi</span></div>
                                    <div className="ladies-program-body">
                                        <h4>Enseignement aux Veuves</h4>
                                        <div className="ladies-program-time"><FaClock className="ladies-clock" /><span>7h00 – 8h00</span></div>
                                        <p>Un moment de soutien, de prière et de la Parole de Dieu dédié aux veuves.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ladies-values">
                                {['Étude Biblique', 'Vision Pastorale', 'Amour Fraternel', 'Rayonnement'].map((v, i) => (
                                    <div key={i} className="ladies-value">
                                        {[<FaBible />, <FaChurch />, <FaHeart />, <FaHandsHelping />][i]}
                                        <span>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Ladies Carousel - 3 images visible at a time */}
                    <div className="ministry-photo-carousel">
                        <button 
                            className="carousel-arrow carousel-arrow--left" 
                            onClick={ladiesPrevImage}
                            disabled={ladiesCurrentIndex === 0}
                        >
                            <FaChevronLeft />
                        </button>
                        
                        <div className="carousel-track-container">
                            <div 
                                className="carousel-track"
                                style={{ transform: `translateX(-${ladiesCurrentIndex * (100 / 3)}%)` }}
                            >
                                {ladiesPhotos.map((src, i) => (
                                    <div key={i} className="carousel-slide">
                                        <img src={src} alt={`Femmes ${i + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <button 
                            className="carousel-arrow carousel-arrow--right" 
                            onClick={ladiesNextImage}
                            disabled={ladiesCurrentIndex === ladiesMaxIndex}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ CHOIRS & WORSHIP TEAM ══ */}
            <section className="choirs-section">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="choirs-header"
                    >
                        <span className="section-tag">Louange & Adoration</span>
                        <h2>Notre Équipe de Louange</h2>
                        <p>Des coeurs unis pour exalter le nom de Jésus à travers le chant et la musique</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="worship-team-card"
                    >
                        <div className="worship-team-image">
                            <img 
                                src={worshipTeamImage}
                                alt="Équipe de Louange"
                            />
                        </div>
                        <div className="worship-team-info">
                            <h3>Équipe de Louange & Adoration</h3>
                            <p>Notre équipe de louange est composée de musiciens et choristes passionnés, dédiés à créer une atmosphère de présence divine à chaque culte. Ils nous guident dans l'adoration chaque dimanche et lors des événements spéciaux.</p>
                            <div className="worship-team-stats">
                                <div className="worship-stat">
                                    <span className="worship-stat-number">15+</span>
                                    <span className="worship-stat-label">Membres</span>
                                </div>
                                <div className="worship-stat">
                                    <span className="worship-stat-number">6</span>
                                    <span className="worship-stat-label">Instruments</span>
                                </div>
                                <div className="worship-stat">
                                    <span className="worship-stat-number">4</span>
                                    <span className="worship-stat-label">Chœurs</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="choirs-grid">
                        {[
                            {
                                name: 'Les Messagers du Christ',
                                description: 'Chœur évangélique dédié à annoncer la bonne nouvelle à travers le chant',
                                image: choirMessagers,
                                founded: '2005'
                            },
                            {
                                name: 'Ujasiri',
                                description: 'Chœur de jeunes pleins de fougue et de passion pour la louange',
                                image: choirUjasiri,
                                founded: '2010'
                            },
                            {
                                name: 'Ufunuo',
                                description: 'Chœur prophétique qui chante la révélation de la Parole de Dieu',
                                image: choirUfunuo,
                                founded: '2012'
                            },
                            {
                                name: 'Smyrna',
                                description: 'Chœur d\'intercession à travers le chant et la prière',
                                image: choirSmyrna,
                                founded: '2008'
                            }
                        ].map((choir, index) => (
                            <motion.div
                                key={index}
                                className="choir-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (index * 0.1) }}
                            >
                                <div className="choir-image">
                                    <img src={choir.image} alt={choir.name} />
                                    <div className="choir-founded">{choir.founded}</div>
                                </div>
                                <div className="choir-info">
                                    <h4>{choir.name}</h4>
                                    <p>{choir.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ MISSION & VISION ══ */}
            <section className="mission-section">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mission-vision-wrapper">
                        <div className="mv-grid">
                            <div className="mv-card mv-card--vision">
                                <div className="mv-card-inner">
                                    <span className="mv-label">Notre Vision</span>
                                    <h2>Vision</h2>
                                    <p>
                                        La 8ᵉ CEPAC PENUEL Swahilophone se veut être <em>« Une Église vivante, unie et émergeant d'un leadership performant dans l'expansion de l'Évangile du Christ dans le monde entier et utilisant le charisme de chaque membre ».</em>
                                    </p>
                                </div>
                            </div>
                            <div className="mv-card mv-card--mission">
                                <div className="mv-card-inner">
                                    <span className="mv-label">Notre Mission</span>
                                    <h2>Mission</h2>
                                    <p className="mv-subtitle">Salut holistique des hommes :</p>
                                    <ul className="mv-list">
                                        <li>Évangéliser les contrées proches et lointaines ;</li>
                                        <li>Promouvoir les œuvres sociales et les valeurs chrétiennes.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((s, i) => (
                            <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <div className="stat-icon">{s.icon}</div>
                                <div className="stat-number"><AnimatedCounter target={s.value} suffix={s.suffix} /></div>
                                <div className="stat-label">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ ÉVÉNEMENTS ══ */}
            {upcomingEvents.length > 0 && (
                <section className="events-section">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-tag">ÉVÉNEMENTS À VENIR</span>
                            <h2>Ne Manquez Pas Ces Moments</h2>
                        </div>
                        <div className="events-grid">
                            {upcomingEvents.map((event, index) => (
                                <motion.div key={event.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="event-card">
                                    <div className="event-date">
                                        <span className="date-day">{new Date(event.event_date).getDate()}</span>
                                        <span className="date-month">{new Date(event.event_date).toLocaleString('fr', { month: 'short' })}</span>
                                    </div>
                                    <div className="event-details">
                                        <h3>{event.title}</h3>
                                        <p><FaCalendarAlt /> {new Date(event.event_date).toLocaleDateString('fr')} à {event.event_time}</p>
                                        <p><FaMapMarkerAlt /> {event.location}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══ FOOTER ══ */}
            <footer className="footer">
                <div className="footer-top">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="footer-logo"><FaChurch className="footer-logo-icon" /><span>8ème CEPAC<br />PENUEL SWAHILOPHONE</span></div>
                            <p className="footer-tagline">Une Église Familiale, Dynamique et Missionnaire — ancrée dans la foi, ouverte à tous.</p>
                            <div className="footer-socials">
                                <a href="#" className="social-btn" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
                                <a href="#" className="social-btn" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg></a>
                                <a href="#" className="social-btn" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.862L.057 23.012a.75.75 0 00.93.93l5.15-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.666-.523-5.184-1.434l-.371-.221-3.853 1.1 1.1-3.853-.221-.371A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg></a>
                            </div>
                        </div>
                        <div className="footer-col">
                            <h4>Navigation</h4>
                            <ul>
                                <li><a href="/">Accueil</a></li>
                                <li><a href="/sermons">Prédications</a></li>
                                <li><a href="/events">Événements</a></li>
                                <li><a href="/prayer">Prière</a></li>
                                <li><a href="/giving">Offrandes</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Nos Ministères</h4>
                            <ul>
                                <li><a href="#">École du Dimanche</a></li>
                                <li><a href="#">Ministère de la Jeunesse</a></li>
                                <li><a href="#">Ministère des Femmes</a></li>
                                <li><a href="#">Groupe de Prière</a></li>
                                <li><a href="#">Louange & Adoration</a></li>
                            </ul>
                        </div>
                        <div className="footer-col footer-contact">
                            <h4>Nous Trouver</h4>
                            <ul>
                                <li><FaMapMarkerAlt className="footer-contact-icon" /><span>Bukavu, République Démocratique du Congo</span></li>
                                <li><svg className="footer-contact-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg><span>+243 977 103 630</span></li>
                                <li><svg className="footer-contact-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><span>contact@cepacpenuel.org</span></li>
                                <li><FaClock className="footer-contact-icon" /><span>Dimanche : 8h30 – 14h30</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} 8ème CEPAC PENUEL SWAHILOPHONE. Tous droits réservés.</p>
                    <p>Fait avec <FaHeart style={{ color: 'var(--gold)', margin: '0 4px', verticalAlign: 'middle' }} /> pour la Gloire de Dieu</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;