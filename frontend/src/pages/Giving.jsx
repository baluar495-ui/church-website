import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FaHeart, 
    FaHandHoldingHeart, 
    FaDonate, 
    FaMoneyBillWave, 
    FaMobileAlt, 
    FaUniversity, 
    FaCopy, 
    FaCheck, 
    FaChurch, 
    FaPrayingHands,
    FaInfoCircle,
    FaEnvelope,
    FaHands
} from 'react-icons/fa';
import { GiReceiveMoney, GiHand, GiMoneyStack } from 'react-icons/gi';
import { MdAttachMoney } from 'react-icons/md';
import './Giving.css';

function Giving() {
    const [copied, setCopied] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('mobile');

    const bankDetails = {
        bank: 'Trust Merchant Bank (TMB)',
        accountName: '8ème CEPAC PENUEL SWAHILOPHONE',
        accountNumber: '1234567890',
        currency: 'CDF / USD'
    };

    const mobileMoneyDetails = {
        provider: 'Airtel Money / Vodacom M-Pesa',
        number: '+243 977 103 630',
        name: '8ème CEPAC PENUEL'
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const givingMethods = [
        {
            id: 'mobile',
            icon: <FaMobileAlt />,
            title: 'Mobile Money',
            description: 'Airtel Money, Vodacom M-Pesa'
        },
        {
            id: 'bank',
            icon: <FaUniversity />,
            title: 'Virement Bancaire',
            description: 'Transfert direct vers notre compte'
        },
        {
            id: 'cash',
            icon: <FaMoneyBillWave />,
            title: 'En Personne',
            description: 'Pendant nos cultes ou à l\'église'
        }
    ];

    return (
        <div className="giving-page">
            {/* Hero Section */}
            <section className="giving-hero">
                <div className="giving-hero-overlay"></div>
                <div className="giving-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <FaHandHoldingHeart className="giving-hero-icon" />
                        <h1>Offrandes & Dons</h1>
                        <p>Donnez avec joie et participez à l'œuvre de Dieu</p>
                    </motion.div>
                </div>
            </section>

            {/* Introduction */}
            <section className="giving-intro">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="giving-intro-content"
                    >
                        <FaHeart className="intro-icon" />
                        <h2>Donner avec un cœur reconnaissant</h2>
                        <p>
                            « Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte; 
                            car Dieu aime celui qui donne avec joie. » — 2 Corinthiens 9:7
                        </p>
                        <p>
                            Votre offrande soutient notre mission d'évangélisation, nos œuvres sociales, 
                            et la vie de notre communauté. Nous vous remercions pour votre générosité.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Giving Methods */}
            <section className="giving-methods">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title">Comment donner ?</h2>
                        <p className="section-subtitle">Choisissez la méthode qui vous convient le mieux</p>

                        <div className="methods-grid">
                            {givingMethods.map((method, index) => (
                                <motion.div
                                    key={method.id}
                                    className={`method-card ${selectedMethod === method.id ? 'active' : ''}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setSelectedMethod(method.id)}
                                >
                                    <div className="method-icon">{method.icon}</div>
                                    <h3>{method.title}</h3>
                                    <p>{method.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Giving Details */}
            <section className="giving-details">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="details-wrapper"
                    >
                        {selectedMethod === 'mobile' && (
                            <div className="details-content">
                                <h3><FaMobileAlt className="details-icon" /> Mobile Money</h3>
                                <p>Envoyez votre offrande via Airtel Money ou Vodacom M-Pesa</p>
                                <div className="details-info">
                                    <div className="info-row">
                                        <span className="info-label">Numéro :</span>
                                        <span className="info-value">{mobileMoneyDetails.number}</span>
                                        <button 
                                            className="btn-copy"
                                            onClick={() => copyToClipboard(mobileMoneyDetails.number)}
                                        >
                                            {copied ? <FaCheck /> : <FaCopy />}
                                        </button>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Nom :</span>
                                        <span className="info-value">{mobileMoneyDetails.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Opérateurs :</span>
                                        <span className="info-value">Airtel Money, Vodacom M-Pesa</span>
                                    </div>
                                </div>
                                <div className="giving-note">
                                    <p><FaInfoCircle className="note-icon" /> <strong>Note :</strong> Après votre envoi, veuillez nous envoyer un message de confirmation.</p>
                                </div>
                            </div>
                        )}

                        {selectedMethod === 'bank' && (
                            <div className="details-content">
                                <h3><FaUniversity className="details-icon" /> Virement Bancaire</h3>
                                <p>Effectuez un transfert direct vers notre compte bancaire</p>
                                <div className="details-info">
                                    <div className="info-row">
                                        <span className="info-label">Banque :</span>
                                        <span className="info-value">{bankDetails.bank}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Titulaire :</span>
                                        <span className="info-value">{bankDetails.accountName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Numéro de compte :</span>
                                        <span className="info-value">{bankDetails.accountNumber}</span>
                                        <button 
                                            className="btn-copy"
                                            onClick={() => copyToClipboard(bankDetails.accountNumber)}
                                        >
                                            {copied ? <FaCheck /> : <FaCopy />}
                                        </button>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Devise :</span>
                                        <span className="info-value">{bankDetails.currency}</span>
                                    </div>
                                </div>
                                <div className="giving-note">
                                    <p><FaInfoCircle className="note-icon" /> <strong>Note :</strong> Veuillez utiliser votre nom comme référence du virement.</p>
                                </div>
                            </div>
                        )}

                        {selectedMethod === 'cash' && (
                            <div className="details-content">
                                <h3><FaHands className="details-icon" /> Offrande en Personne</h3>
                                <p>Vous pouvez donner directement pendant nos cultes ou à l'église</p>
                                <div className="details-info">
                                    <div className="info-row">
                                        <span className="info-label">Pendant les cultes :</span>
                                        <span className="info-value">Dimanche 8h30 – 14h30</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">En semaine :</span>
                                        <span className="info-value">Mercredi & Vendredi 19h00</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Adresse :</span>
                                        <span className="info-value">
                                            Avenue Kindu, Quartier Ndendere, N° 003<br />
                                            Commune d'Ibanda, Bukavu
                                        </span>
                                    </div>
                                </div>
                                <div className="giving-note">
                                    <p><FaInfoCircle className="note-icon" /> <strong>Note :</strong> Des enveloppes d'offrande sont disponibles à l'entrée.</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Why Give */}
            <section className="giving-impact">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Où va votre offrande ?</h2>
                        <div className="impact-grid">
                            <div className="impact-card">
                                <FaChurch className="impact-icon" />
                                <h3>Évangélisation</h3>
                                <p>Soutenir nos missions locales et internationales pour répandre l'Évangile.</p>
                            </div>
                            <div className="impact-card">
                                <FaHandHoldingHeart className="impact-icon" />
                                <h3>Œuvres Sociales</h3>
                                <p>Aider les veuves, les orphelins et les personnes dans le besoin.</p>
                            </div>
                            <div className="impact-card">
                                <FaPrayingHands className="impact-icon" />
                                <h3>Vie de l'Église</h3>
                                <p>Maintenir nos cultes, programmes et activités spirituelles.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="giving-cta">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <FaDonate className="cta-icon" />
                        <h2>Donnez aujourd'hui</h2>
                        <p>Chaque offrande est une semence qui porte du fruit pour la gloire de Dieu.</p>
                        <div className="cta-buttons">
                            <button 
                                className="btn-primary"
                                onClick={() => window.location.href = '/contact'}
                            >
                                Nous contacter
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default Giving;