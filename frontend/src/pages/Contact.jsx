import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUser, FaComment, FaPaperPlane, FaCheckCircle, FaWhatsapp, FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import { contactAPI } from '../services/api';
import './Contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Veuillez entrer votre nom';
        }
        if (!formData.email.trim()) {
            errors.email = 'Veuillez entrer votre email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Veuillez entrer une adresse email valide';
        }
        if (!formData.subject.trim()) {
            errors.subject = 'Veuillez entrer un sujet';
        }
        if (!formData.message.trim()) {
            errors.message = 'Veuillez écrire votre message';
        } else if (formData.message.trim().length < 10) {
            errors.message = 'Votre message doit contenir au moins 10 caractères';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit contact form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim()
            };
            
            await contactAPI.submit(payload);
            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setError('Une erreur est survenue. Veuillez réessayer plus tard.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="contact-hero-overlay"></div>
                <div className="contact-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1>Contactez-nous</h1>
                        <p>Nous sommes là pour vous écouter, vous servir et prier avec vous.</p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="contact-section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <motion.div
                            className="contact-info"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2>Informations de contact</h2>
                            <p>N'hésitez pas à nous contacter pour toute question, prière ou suggestion.</p>

                            <div className="contact-info-items">
                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h4>Adresse</h4>
                                        <p>
                                            <strong>8ème CEPAC PENUEL SWAHILOPHONE</strong><br />
                                            Avenue Kindu, Quartier Ndendere, N° 003<br />
                                            Commune d'Ibanda, Ville de Bukavu<br />
                                            Province du Sud-Kivu, République Démocratique du Congo
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                                            📍 En face de l'Hôtel Delicia, non loin de CADECO
                                        </p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <FaPhone />
                                    </div>
                                    <div>
                                        <h4>Téléphone</h4>
                                        <p><a href="tel:+243977103630">+243 977 103 630</a></p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <h4>Email</h4>
                                        <p><a href="mailto:contact@cepacpenuel.org">contact@cepacpenuel.org</a></p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <FaClock />
                                    </div>
                                    <div>
                                        <h4>Horaires des cultes</h4>
                                        <p><strong>Dimanche :</strong> 8h30 – 14h30</p>
                                        <p><strong>Mercredi :</strong> 19h00 (Étude Biblique)</p>
                                        <p><strong>Vendredi :</strong> 19h00 (Prière & Intercession)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="contact-social">
                                <h4>Suivez-nous</h4>
                                <div className="social-links">
                                    <a href="#" className="social-link" aria-label="WhatsApp">
                                        <FaWhatsapp />
                                    </a>
                                    <a href="#" className="social-link" aria-label="Facebook">
                                        <FaFacebook />
                                    </a>
                                    <a href="#" className="social-link" aria-label="YouTube">
                                        <FaYoutube />
                                    </a>
                                    <a href="#" className="social-link" aria-label="Instagram">
                                        <FaInstagram />
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            className="contact-form-wrapper"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="contact-form-header">
                                <h2>Envoyez-nous un message</h2>
                                <p>Nous vous répondrons dans les plus brefs délais.</p>
                            </div>

                            {submitSuccess && (
                                <div className="contact-success">
                                    <FaCheckCircle />
                                    <div>
                                        <h4>Message envoyé avec succès !</h4>
                                        <p>Merci de nous avoir contactés. Nous vous répondrons bientôt.</p>
                                    </div>
                                </div>
                            )}

                            {error && !submitSuccess && (
                                <div className="contact-error">
                                    <p>{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">
                                        <FaUser /> Votre nom
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Entrez votre nom complet"
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
                                        placeholder="votre@email.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={formErrors.email ? 'error' : ''}
                                    />
                                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">
                                        <FaComment /> Sujet
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="Sujet de votre message"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className={formErrors.subject ? 'error' : ''}
                                    />
                                    {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">
                                        <FaComment /> Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Écrivez votre message ici..."
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className={formErrors.message ? 'error' : ''}
                                    ></textarea>
                                    {formErrors.message && <span className="error-message">{formErrors.message}</span>}
                                    <small>{formData.message.length} caractères</small>
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
                                                <FaPaperPlane /> Envoyer le message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="contact-cta">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Vous avez besoin de prière ?</h2>
                        <p>Notre équipe de prière est disponible pour vous soutenir.</p>
                        <button 
                            className="btn-primary"
                            onClick={() => window.location.href = '/prayer'}
                        >
                            Soumettre une demande de prière
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default Contact;