import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
    FaPlay, FaCalendarAlt, FaMapMarkerAlt, FaUserFriends,
    FaHandsHelping, FaHeart, FaBible, FaChild, FaStar,
    FaBook, FaFire, FaFemale, FaPray, FaChurch, FaClock,
    FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { eventsAPI } from '../services/api';
import './Home.css';

/* ── Animated counter component ── */
function AnimatedCounter({ target, suffix = '', duration = 2 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const motionVal = useMotionValue(0);
    const springVal = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (isInView) motionVal.set(target);
    }, [isInView, target, motionVal]);

    useEffect(() => {
        return springVal.on('change', (v) => setDisplay(Math.round(v)));
    }, [springVal]);

    return <span ref={ref}>{display}{suffix}</span>;
}

function Home() {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    /* Hero slides — replace image URLs with your real church photos */
    const heroSlides = [
        {
            image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGYufIJ3gVm571JOK0LRLKRFT8knlXb6i4Y9DGZGYwN7_h90KXo2m-RZ3ubcDa64ZSTCH3xzvdB6bv8pBnVDt4shR8wNEejAjJZ0GNO3-wJVfpQQJN8fn3FRNHQXwq0rG7Q3kTGSKaapNb5=s680-w680-h510-rw',
            title: 'Bienvenue à la 8ème CEPAC PENUEL SWAHILOPHONE',
            subtitle: 'Une Église Familiale, Dynamique et Missionnaire',
        },
        {
            image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAElRep42rtkaySwZnrVEmDxOgOgPaikzts9DLzy83W5osb84-4Q8ZdM7dppjczLX2afalM2KPqnPw8076CSULoRuYRoKUHLxvEqtZOrJ9KVz2XyPDat2UlCEQSdu2Nsot0CuhjjHQ=s680-w680-h510-rw',
            title: 'Adorez Dieu en Esprit et en Vérité',
            subtitle: 'Rejoignez-nous chaque Dimanche pour un culte puissant',
        },
        {
            image: 'https://yt3.googleusercontent.com/tInTIzrC19C-GgvYRXWahDBz6kreBi5mfNecwCeYAJpgGtaxIDO8KYC-9yr2gNB6zoKYWyFiWg=s900-c-k-c0x00ffffff-no-rj',
            title: 'Ensemble, Nous Faisons la Différence',
            subtitle: 'Une communauté unie par la foi, l\'espérance et l\'amour',
        },
    ];

    /* Auto-advance hero */
    useEffect(() => {
        const t = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5000);
        return () => clearInterval(t);
    }, [heroSlides.length]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await eventsAPI.getUpcoming();
                setUpcomingEvents(res.data.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const weeklySchedule = [
        { day: 'Dimanche',  time: '8h00 – 10h15',  label: '1er Culte',           color: 'gold' },
        { day: 'Dimanche',  time: '10h15 – 12h30', label: '2ème Culte',           color: 'gold' },
        { day: 'Mardi',     time: '16h00 – 18h00', label: 'Culte du Mardi',       color: 'navy' },
        { day: 'Mercredi',  time: '9h00 – 12h00',  label: 'Culte Femmes Veuves',  color: 'rose' },
        { day: 'Jeudi',     time: '16h00 – 18h00', label: 'Culte du Jeudi',       color: 'navy' },
        { day: 'Vendredi',  time: '16h00 – 18h00', label: 'Culte Mamans Jeunes',  color: 'rose' },
    ];

    const stats = [
        { value: 25, suffix: '+', label: 'Années de Ministère', icon: <FaChurch /> },
        { value: 300, suffix: '+', label: 'Familles Servies',   icon: <FaUserFriends /> },
        { value: 6,  suffix: '',  label: 'Cultes par Semaine',  icon: <FaBible /> },
        { value: 5,  suffix: '',  label: 'Ministères Actifs',   icon: <FaHandsHelping /> },
    ];

    /* Ministry gallery photos — replace with real ones later */
    const sundaySchoolPhotos = [
        'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/722974953_1799185491425854_8300661758474211644_n.jpg?stp=ae6_dst-jpg_tt6&cstp=mx715x954&ctp=s715x954&_nc_cat=109&ccb=1-7&_nc_sid=bdeb5f&_nc_eui2=AeFEIt2-JjQmgSUjdq1s2oARfqJ_zTwsGzN-on_NPCwbM4s_ZUVqtsbLU9AcnIe8CYvwRER3a9LITbi_6sHK_HnS&_nc_ohc=ij1B8x_PqxEQ7kNvwHBFKhk&_nc_oc=Ado5qAQjkZtGtd2-_1MTtA0DrF28gJ6KP_MwMkmNY6NmIg1F0RBoGbyctUtCg0bdtQY&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=Sq8a_0euY6f4W8MRL-2JcQ&_nc_ss=7b2a8&oh=00_Af-XSKfucanDt9muDyUhQLuSDAPLCktEVjaRx7ax6wcPfw&oe=6A310D2B',
        'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/722934836_1799185368092533_4425065542935263853_n.jpg?stp=ae6_dst-jpg_tt6&cstp=mx540x960&ctp=s540x960&_nc_cat=100&ccb=1-7&_nc_sid=bdeb5f&_nc_eui2=AeGLHTuKC5V6wpXVyMnX6KPYKRNbaJ-_F64pE1ton78XrnaxrsawVJwDThdgZ9fJptjB9BMW4JZ788A81MuqbVtX&_nc_ohc=rH8ge2PoxogQ7kNvwF_4NO4&_nc_oc=AdryiJmLGrPEhh_78U3kLo44XqKmnNnECbsMtpIjia9Wywg4ix6lQlFfPCpCjxhPyno&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=AiKs49EZ34i5NM1bJTQHVQ&_nc_ss=7b2a8&oh=00_Af92wtdc2pZH6GNj3qWF5t7gAug28ckgMcryeYTGZqNkIQ&oe=6A31086A',
        'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/722973946_1799185631425840_1908383001485397374_n.jpg?stp=ae6_dst-jpg_tt6&cstp=mx540x960&ctp=s540x960&_nc_cat=104&ccb=1-7&_nc_sid=bdeb5f&_nc_eui2=AeEd2wNg6kYUKOXTHie-WaDPoNqPZzpKpwGg2o9nOkqnAX09qoYp4zUvYKt2cCjG1SNlIFs4gzPa8AbXx_GhlpF9&_nc_ohc=8CZi4p83UE0Q7kNvwHk22Ko&_nc_oc=AdpyjEc3rAuMGQ6K2qyKGFv03tWIrbTgb1zkjI4-T__comN4O3fp6K6UIWSmeMgZ_fc&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=Sq8a_0euY6f4W8MRL-2JcQ&_nc_ss=7b2a8&oh=00_Af863LsdIXCzFBDG7ZLG5DviYX_g0o6qMmYrggkgpVRPoA&oe=6A31071E',
    ];
    const youthPhotos = [
        'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/657413505_945213547866987_6910953000485729918_n.jpg?stp=dst-jpg_tt6&cstp=mx1280x832&ctp=s1280x832&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFk4F-f4HYse-roJCzHBoiaXH03N1RlEfxcfTc3VGUR_P5OcVp5ADFg5MZ-QP6g9SZMm84CigacnSrNOvyJF0uZ&_nc_ohc=XMFe6ZdxftcQ7kNvwFdNHsO&_nc_oc=AdrbjsOpWFlMPrma7b33aKPQLIQ1HKVKaWiK-q98U3_AZLphUZXCVWGrJHJoXGVNdyQ&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=puiggvPr37IX9GKRxemDfg&_nc_ss=7b2a8&oh=00_Af__YQPTz0MAy1swHnMNue-Z-6hb8sF5VeQ_yqK-sDXxJA&oe=6A31106C',
        'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/651217309_933120905742918_8587231961274764450_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x944&ctp=s1536x944&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFOevYkKjSeSp-if8TPgXK-Gqpq4gP3nCcaqmriA_ecJ80jE8ZwzyIkDZ5kEPFS_vR5S68UVGV78BDxa472_t-r&_nc_ohc=ytQYU4FTiicQ7kNvwHH1IyZ&_nc_oc=AdqA4inr4gHR5w67vYAsOEULyxtk7fbs-YkAc8C76MxZuhE8fxpIpsHZ5o-_0cHpVF0&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=S2EyahCoXJDK7QbdouUUyA&_nc_ss=7b2a8&oh=00_Af9XG4l97gxmhBvsAjlIT9pjNj0dU-SZkTNJeF00UmiUrg&oe=6A3107DF',
        'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/651193294_933118482409827_4118549617108102416_n.jpg?stp=dst-jpg_tt6&cstp=mx1769x985&ctp=s1769x985&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFzQNFUWCmuWhtvojmAsPN60CmuHH3k8yXQKa4cfeTzJTqLIgn63vQcNH8x5J5MpBZf2UAl6ZVQrqKS-sWqy_0n&_nc_ohc=SJ-HIc8ZD1QQ7kNvwGGaSjz&_nc_oc=Adr4yJZ-1iYOYqsToqYnMRygY3qiWgrcgjllUaDHFGtN7fnU2HCrK4OBqpZ2LkoX3ew&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=fGyl2TJcpbWkaQoNalFAJg&_nc_ss=7b2a8&oh=00_Af_AK4zDSepTNBc3Uqc5ZgtRRDU2rte3iYb_0BvdCsnPaA&oe=6A310546',
    ];
    const ladiesPhotos = [
        'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/647449865_926764446378564_6315663648788551354_n.jpg?stp=dst-jpg_tt6&cstp=mx960x1280&ctp=s960x1280&_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEtWs6Z-rO99-hhwTFVkj0a4zgzB7oGyQXjODMHugbJBflfseR1pmFuK-rREAWnCcHcbfwGb4Xft4Qro7D6rJuK&_nc_ohc=F2CM2kkinqMQ7kNvwFVB0NP&_nc_oc=Ado2yxbPaAq5o7WGg3_anQB9TVkf6CI-T1uLqN3mVtuilPAexLAgcaX-VF2dfycs7uc&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=LDtqEhXwkcsqwqY7qS_HFw&_nc_ss=7b2a8&oh=00_Af9JLWuOsBFU_u9q0bP3W6X65eU-z80f1D0KRGXj07-MAQ&oe=6A310DC0',
        'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/649075255_926764613045214_380641747846057116_n.jpg?stp=dst-jpg_tt6&cstp=mx960x1280&ctp=s960x1280&_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHboVHzKhhyT4VFSwMCFmkNCU5ed-qVffUJTl536pV99dGwM4r8B_C5L9PXy6f_TXwYdTL0hpAhbir0UUVjAWtC&_nc_ohc=8RJNP1yxqGIQ7kNvwGlEhmP&_nc_oc=AdotVZ45Pc1ANNxdmlfH3cPpy_QCX_dXgVg9hLus6W0cOpodsV6j5o1koo_VLSgchTw&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=lR2Kq3Ebi4tSWPKQE7tKOQ&_nc_ss=7b2a8&oh=00_Af8AO6HkVnFlSi6qi48jH7LWpTDUr9ARqxdGCKkQYFgYaw&oe=6A30F61E',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80',
    ];

    const slides = [
        {
            title: 'Bienvenue à Notre Famille',
            description: 'Vous êtes chez vous ici. Peu importe votre histoire, vous avez une place dans notre communauté.',
            features: ['Accueil chaleureux', 'Messages inspirants', 'Communauté aimante'],
        },
        {
            title: 'Notre Leadership',
            pastorName: 'Dr. Reverend Pasteur Batuvanwa Wilondja Imani Matabishi',
            pastorTitle: 'Pasteur Principal',
            image: 'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/481255379_10236302544884150_8200088112727258429_n.jpg?stp=dst-jpg_tt6&cstp=mx1706x1693&ctp=s1706x1693&_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFGCTFMtOP21bICUBOUPn4GAo5rkkIsWt4CjmuSQixa3hBWuzkzKDSrsJZ402H9EO_UbvXdyM93gRsd2QDJ0mA8&_nc_ohc=FiaEt_si07oQ7kNvwFfQ-D9&_nc_oc=AdqWdlaXcvvxKXfAZO595Hn3Lg1o_j3Bagu9ei4b-_o62wkcbNm0KbKqfiB9eTthl2g&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=cfy_wBt12D8jWnRTMopzdw&_nc_ss=7a2a8&oh=00_Af-sUpLFsLa58QWYygbFMR1FMelzSw-suoGxCO0ulI5NBw&oe=6A2F7BBC',
            bio: "Un homme de Dieu passionné par l'évangélisation et l'édification des familles",
        },
        {
            title: 'Notre Mission',
            mission: "Former des disciples, toucher les âmes et transformer les communautés par la puissance de l'Évangile de Jésus-Christ.",
        },
    ];

    return (
        <div className="home">

            {/* ══════════════════════════════════════
                HERO — ROTATING
            ══════════════════════════════════════ */}
            <section className="hero-section">
                {heroSlides.map((slide, i) => (
                    <div
                        key={i}
                        className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />
                ))}
                <div className="hero-overlay" />
                <div className="hero-content">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="hero-text"
                    >
                        <span className="hero-tag">8ÈME CEPAC PENUEL SWAHILOPHONE</span>
                        <h1>{heroSlides[currentSlide].title}</h1>
                        <p>{heroSlides[currentSlide].subtitle}</p>
                        <div className="hero-buttons">
                            <button className="btn-primary">Planifiez Votre Visite</button>
                            <button className="btn-outline">
                                <FaPlay style={{ marginRight: 8 }} /> Regarder en Direct
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Arrows */}
                <button className="hero-arrow hero-arrow--left" onClick={() => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length)}>
                    <FaChevronLeft />
                </button>
                <button className="hero-arrow hero-arrow--right" onClick={() => setCurrentSlide(p => (p + 1) % heroSlides.length)}>
                    <FaChevronRight />
                </button>

                {/* Dots */}
                <div className="slide-indicators">
                    {heroSlides.map((_, i) => (
                        <button key={i} className={`indicator ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                SERVICE TIMES BAR
            ══════════════════════════════════════ */}
            <div className="service-bar">
                <div className="service-bar-inner">
                    <div className="service-bar-item">
                        <span className="service-bar-label">1er Culte — Dimanche</span>
                        <span className="service-bar-time">8h00 – 10h15</span>
                    </div>
                    <div className="service-bar-divider">•</div>
                    <div className="service-bar-item">
                        <span className="service-bar-label">2ème Culte — Dimanche</span>
                        <span className="service-bar-time">10h15 – 12h30</span>
                    </div>
                    <div className="service-bar-divider">•</div>
                    <div className="service-bar-item">
                        <span className="service-bar-label">Culte — Mardi & Jeudi</span>
                        <span className="service-bar-time">16h00 – 18h00</span>
                    </div>
                    <div className="service-bar-divider">•</div>
                    <div className="service-bar-item">
                        <span className="service-bar-label">Ministère des Femmes</span>
                        <span className="service-bar-time">Mer & Ven</span>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                NOS CULTES
            ══════════════════════════════════════ */}
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
                            <img src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGYufIJ3gVm571JOK0LRLKRFT8knlXb6i4Y9DGZGYwN7_h90KXo2m-RZ3ubcDa64ZSTCH3xzvdB6bv8pBnVDt4shR8wNEejAjJZ0GNO3-wJVfpQQJN8fn3FRNHQXwq0rG7Q3kTGSKaapNb5=s680-w680-h510-rw" alt="Worship" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                BIENVENUE
            ══════════════════════════════════════ */}
            <section className="welcome-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="welcome-grid">
                        <div className="welcome-image">
                            <img src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAElRep42rtkaySwZnrVEmDxOgOgPaikzts9DLzy83W5osb84-4Q8ZdM7dppjczLX2afalM2KPqnPw8076CSULoRuYRoKUHLxvEqtZOrJ9KVz2XyPDat2UlCEQSdu2Nsot0CuhjjHQ=s680-w680-h510-rw" alt="Church family" />
                        </div>
                        <div className="welcome-content">
                            <span className="section-tag">Notre Communauté</span>
                            <h2>{slides[0].title}</h2>
                            <p>{slides[0].description}</p>
                            <div className="welcome-features">
                                {slides[0].features.map((f, i) => (
                                    <div key={i} className="feature"><FaUserFriends className="feature-icon" /><span>{f}</span></div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                ÉCOLE DU DIMANCHE
            ══════════════════════════════════════ */}
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
                            <img src="https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/722973946_1799185631425840_1908383001485397374_n.jpg?stp=ae6_dst-jpg_tt6&cstp=mx540x960&ctp=s540x960&_nc_cat=104&ccb=1-7&_nc_sid=bdeb5f&_nc_eui2=AeEd2wNg6kYUKOXTHie-WaDPoNqPZzpKpwGg2o9nOkqnAX09qoYp4zUvYKt2cCjG1SNlIFs4gzPa8AbXx_GhlpF9&_nc_ohc=8CZi4p83UE0Q7kNvwHk22Ko&_nc_oc=AdpyjEc3rAuMGQ6K2qyKGFv03tWIrbTgb1zkjI4-T__comN4O3fp6K6UIWSmeMgZ_fc&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=8AaKsS8McrupjTJ6TwcBGQ&_nc_ss=7b2a8&oh=00_Af99V0FeMkYvoF1wi2KB-Vnwxr0n3o1Ro8MtTmacT0dgIA&oe=6A31071E" alt="École du Dimanche" />
                            <div className="ss-image-badge">
                                <span className="ss-badge-number">2</span>
                                <span className="ss-badge-label">Sessions chaque Dimanche</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Photo strip */}
                    <div className="ministry-photo-strip">
                        {sundaySchoolPhotos.map((src, i) => (
                            <motion.div key={i} className="ministry-photo" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                                <img src={src} alt={`École du Dimanche ${i + 1}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                MINISTÈRE DE LA JEUNESSE
            ══════════════════════════════════════ */}
            <section className="youth-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="youth-grid">
                        <div className="youth-leader-col">
                            <div className="youth-leader-card">
                                <div className="youth-leader-img-wrap">
                                    <img src="https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/340983703_581375837299639_4186337075404356417_n.jpg?stp=dst-jpg_tt6&cstp=mx560x840&ctp=s560x840&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHbBEHLfC8bfQuelCDxFuu78nRFcZXvudbydEVxle-51o_uxdBsnHZ8afyRv4-Z3Jp8e4DtHwMox-iP6fEpW0MQ&_nc_ohc=NizFlWDE24QQ7kNvwFI2ua8&_nc_oc=AdpJUbDxr1XVZWK33Ge1PSvQVxWQyuzC74l8p2jYDs9_5su2jgvr0Nrd-Z27Owc3Rqg&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=KkfZyJGNkiIEXb1xDvIk0g&_nc_ss=7b2a8&oh=00_Af_0h6hSxItXu5OA7fWvbFJq6GzRS2iMvADu39tbOEJI_Q&oe=6A30EAD7" alt="Président" />
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

                    {/* Photo strip */}
                    <div className="ministry-photo-strip ministry-photo-strip--dark">
                        {youthPhotos.map((src, i) => (
                            <motion.div key={i} className="ministry-photo" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                                <img src={src} alt={`Jeunesse ${i + 1}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                MINISTÈRE DES FEMMES
            ══════════════════════════════════════ */}
            <section className="ladies-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="ladies-grid">
                        <div className="ladies-image-col">
                            <div className="ladies-img-wrap">
                                <img src="https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/720475301_1799236144754122_7384143351538664905_n.webp?stp=ae6_dst-jpg_tt6&cstp=mx1080x1920&ctp=s1080x1920&_nc_cat=100&ccb=1-7&_nc_sid=bdeb5f&_nc_eui2=AeEitnJDWB1cDcnjIOCioK2nlw8_5tcWdnWXDz_m1xZ2dddKSBLNOfUVfVWYqpM2TDr7uldKZadKsFIBDg90vwiX&_nc_ohc=2VvK8h57wg8Q7kNvwEJFvCs&_nc_oc=Adr_aJ0uWfDJv98Q0Fc_RJU4zsV9yXaZlv7wkxIyq8f5FFqXgOVBYqQ8E5-NfqXY_OE&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=UJ91hZugpjzpNavtVIbJ6w&_nc_ss=7b2a8&oh=00_Af-Ex0-02qng2TvYZW0p2bYBMbqhNzgDMDtDjQFe-GMVTg&oe=6A31002A" alt="Ministère des Femmes" />
                            </div>
                            <div className="ladies-stat-cards">
                                {[
                                    { icon: <FaHeart />, label: 'Sœurs Unies' },
                                    { icon: <FaPray />, label: 'Prière & Louange' },
                                    { icon: <FaHandsHelping />, label: 'Service Communautaire' },
                                ].map((s, i) => (
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
                                        <h4>Culte des Femmes Veuves</h4>
                                        <div className="ladies-program-time"><FaClock className="ladies-clock" /><span>9h00 – 12h00</span></div>
                                        <p>Un moment de soutien, de prière et de la Parole de Dieu dédié aux veuves de notre communauté.</p>
                                    </div>
                                </div>
                                <div className="ladies-program-card">
                                    <div className="ladies-program-header"><span className="ladies-day-badge ladies-day-badge--vendredi">Vendredi</span></div>
                                    <div className="ladies-program-body">
                                        <h4>Culte des Mamans Jeunes</h4>
                                        <div className="ladies-program-time"><FaClock className="ladies-clock" /><span>16h00 – 18h00</span></div>
                                        <p>Rassemblement des jeunes mamans autour de la Parole, du partage et de l'encouragement mutuel.</p>
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

                    {/* Photo strip */}
                    <div className="ministry-photo-strip">
                        {ladiesPhotos.map((src, i) => (
                            <motion.div key={i} className="ministry-photo" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                                <img src={src} alt={`Femmes ${i + 1}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                PASTEUR
            ══════════════════════════════════════ */}
            <section className="pastor-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="pastor-card">
                        <div className="pastor-image">
                            <img src={slides[1].image} alt={slides[1].pastorName} />
                        </div>
                        <div className="pastor-content">
                            <span className="section-tag">Leadership</span>
                            <h2>{slides[1].title}</h2>
                            <h3>{slides[1].pastorName}</h3>
                            <p className="pastor-title">{slides[1].pastorTitle}</p>
                            <p className="pastor-bio">{slides[1].bio}</p>
                            <div className="pastor-quote">
                                <FaBible className="quote-icon" />
                                <p>"L'Église n'est pas un bâtiment, c'est une famille de croyants unis par l'amour du Christ."</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                NOTRE MISSION
            ══════════════════════════════════════ */}
            <section className="mission-section">
                <div className="container-full">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mission-content">
                        <span className="section-tag">Notre Vision</span>
                        <h2>{slides[2].title}</h2>
                        <div className="mission-box">
                            <p className="mission-statement">{slides[2].mission}</p>
                        </div>

                        {/* ── ANIMATED STAT COUNTERS ── */}
                        <div className="stats-grid">
                            {stats.map((s, i) => (
                                <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-number">
                                        <AnimatedCounter target={s.value} suffix={s.suffix} />
                                    </div>
                                    <div className="stat-label">{s.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                ÉVÉNEMENTS
            ══════════════════════════════════════ */}
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

            {/* ══════════════════════════════════════
                FOOTER
            ══════════════════════════════════════ */}
            <footer className="footer">
                <div className="footer-top">
                    <div className="footer-grid">

                        {/* Brand */}
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <FaChurch className="footer-logo-icon" />
                                <span>8ème CEPAC<br />PENUEL SWAHILOPHONE</span>
                            </div>
                            <p className="footer-tagline">Une Église Familiale, Dynamique et Missionnaire — ancrée dans la foi, ouverte à tous.</p>
                            <div className="footer-socials">
                                <a href="#" className="social-btn" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                                </a>
                                <a href="#" className="social-btn" aria-label="YouTube">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                                </a>
                                <a href="#" className="social-btn" aria-label="WhatsApp">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.528 5.862L.057 23.012a.75.75 0 00.93.93l5.15-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.666-.523-5.184-1.434l-.371-.221-3.853 1.1 1.1-3.853-.221-.371A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick links */}
                        <div className="footer-col">
                            <h4>Navigation</h4>
                            <ul>
                                <li><a href="/">Accueil</a></li>
                                <li><a href="/sermons">Prédications</a></li>
                                <li><a href="/events">Événements</a></li>
                                <li><a href="/prayer">Prière</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>

                        {/* Ministères */}
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

                        {/* Contact */}
                        <div className="footer-col footer-contact">
                            <h4>Nous Trouver</h4>
                            <ul>
                                <li>
                                    <FaMapMarkerAlt className="footer-contact-icon" />
                                    <span>Goma, République Démocratique du Congo</span>
                                </li>
                                <li>
                                    <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                                    <span>+243 977 103 630</span>
                                </li>
                                <li>
                                    <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                                    <span>contact@cepacpenuel.org</span>
                                </li>
                                <li>
                                    <FaClock className="footer-contact-icon" />
                                    <span>Dimanche : 8h00 – 12h30</span>
                                </li>
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