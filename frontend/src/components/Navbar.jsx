import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChurch } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'Accueil' },
        { path: '/sermons', label: 'Prédications' },
        { path: '/events', label: 'Événements' },
        { path: '/prayer', label: 'Prière' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <FaChurch className="logo-icon" />
                    8ème CEPAC PENUEL SWAHILOPHONE
                </Link>

                <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button className="btn-give">Offrandes</button>
                </div>

                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;