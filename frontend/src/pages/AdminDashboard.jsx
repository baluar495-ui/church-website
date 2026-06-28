import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes,
    FaPray, FaCalendarAlt, FaMicrophone, FaUserCog, FaUsers,
    FaEye, FaEyeSlash, FaSearch, FaChurch
} from 'react-icons/fa';
import axios from 'axios';
import { useNotification } from '../contexts/NotificationContext';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sermons, setSermons] = useState([]);
    const [events, setEvents] = useState([]);
    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const { showNotification } = useNotification();

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem('adminToken');
    };

    // Create API instance with token interceptor
    const createApiInstance = () => {
        const token = getToken();
        const instance = axios.create({
            baseURL: 'http://localhost:3003/api/admin',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        // Add interceptor to handle token expiration
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    console.error('Token expired or invalid. Please login again.');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    onLogout();
                    showNotification('Session expirée. Veuillez vous reconnecter.', 'error');
                    setTimeout(() => window.location.href = '/admin/login', 1500);
                }
                return Promise.reject(error);
            }
        );

        return instance;
    };

    // Get API instance
    const getApi = () => {
        return createApiInstance();
    };

    // Also create a public API instance for fallback
    const publicApi = axios.create({
        baseURL: 'http://localhost:3003/api',
    });

    // Helper function to format date for input fields (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        } catch (e) {
            return '';
        }
    };

    // Helper function to format date for database (YYYY-MM-DD)
    const formatDateForDB = (dateString) => {
        if (!dateString) return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
        return dateString;
    };

    // Helper function to format time for input fields
    const formatTimeForInput = (timeString) => {
        if (!timeString) return '';
        if (/^\d{2}:\d{2}$/.test(timeString)) return timeString;
        try {
            const date = new Date(`1970-01-01T${timeString}`);
            if (isNaN(date.getTime())) return '';
            return date.toTimeString().slice(0, 5);
        } catch (e) {
            return '';
        }
    };

    // Fetch data
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const api = getApi();
            const [sermonsRes, eventsRes, prayersRes] = await Promise.all([
                api.get('/sermons'),
                api.get('/events'),
                api.get('/prayer-requests')
            ]);
            setSermons(sermonsRes.data.data || []);
            setEvents(eventsRes.data.data || []);
            setPrayers(prayersRes.data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Erreur lors du chargement des données.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle edit button click - properly format dates
    const handleEdit = (item) => {
        const formattedItem = { ...item };
        
        if (formattedItem.sermon_date) {
            formattedItem.sermon_date = formatDateForInput(formattedItem.sermon_date);
        }
        if (formattedItem.event_date) {
            formattedItem.event_date = formatDateForInput(formattedItem.event_date);
        }
        if (formattedItem.event_time) {
            formattedItem.event_time = formatTimeForInput(formattedItem.event_time);
        }
        
        setEditingItem(item);
        setFormData(formattedItem);
        setShowForm(true);
    };

    // Handle form submit for sermons/events
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = getToken();
        if (!token) {
            showNotification('Session expirée. Veuillez vous reconnecter.', 'error');
            onLogout();
            setTimeout(() => window.location.href = '/admin/login', 1500);
            return;
        }

        try {
            const api = getApi();
            const endpoint = activeTab === 'sermons' ? '/sermons' : '/events';
            const method = editingItem ? 'put' : 'post';
            const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;

            const submitData = { ...formData };
            
            if (submitData.sermon_date) {
                submitData.sermon_date = formatDateForDB(submitData.sermon_date);
            }
            if (submitData.event_date) {
                submitData.event_date = formatDateForDB(submitData.event_date);
            }

            // Remove unnecessary fields for sermons
            if (activeTab === 'sermons') {
                delete submitData.video_platform;
                delete submitData.thumbnail;
            }

            console.log('Submitting:', { url, method, submitData });

            const res = await api[method](url, submitData);
           
            if (res.data.success) {
                setShowForm(false);
                setEditingItem(null);
                setFormData({});
                fetchAllData();
                showNotification(
                    editingItem ? 'Mise à jour réussie !' : 'Ajouté avec succès !',
                    'success'
                );
            } else {
                showNotification(res.data.error || 'Une erreur est survenue.', 'error');
            }
        } catch (error) {
            console.error('Error saving:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                showNotification(error.response.data?.error || 'Erreur lors de l\'enregistrement.', 'error');
            } else {
                showNotification('Erreur lors de l\'enregistrement.', 'error');
            }
        }
    };

    // Handle delete
    const handleDelete = async (type, id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
        
        const token = getToken();
        if (!token) {
            showNotification('Session expirée. Veuillez vous reconnecter.', 'error');
            onLogout();
            setTimeout(() => window.location.href = '/admin/login', 1500);
            return;
        }

        try {
            const api = getApi();
            await api.delete(`/${type}/${id}`);
            fetchAllData();
            showNotification('Supprimé avec succès !', 'success');
        } catch (error) {
            console.error('Error deleting:', error);
            showNotification('Erreur lors de la suppression.', 'error');
        }
    };

    // Handle prayer status update
    const handlePrayerStatus = async (id, status) => {
        const token = getToken();
        if (!token) {
            showNotification('Session expirée. Veuillez vous reconnecter.', 'error');
            onLogout();
            setTimeout(() => window.location.href = '/admin/login', 1500);
            return;
        }

        try {
            const api = getApi();
            await api.put(`/prayer-requests/${id}`, { status });
            fetchAllData();
            const statusMessages = {
                approved: 'Demande approuvée !',
                prayed: 'Prière marquée comme faite !'
            };
            showNotification(statusMessages[status] || 'Statut mis à jour !', 'success');
        } catch (error) {
            console.error('Error updating prayer:', error);
            showNotification('Erreur lors de la mise à jour.', 'error');
        }
    };

    // Render form for sermons/events
    const renderForm = () => {
        const isSermon = activeTab === 'sermons';
        const fields = isSermon ? [
            { name: 'title', label: 'Titre', type: 'text', required: true },
            { name: 'speaker', label: 'Prédicateur', type: 'text' },
            { name: 'scripture', label: 'Verset clé', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'sermon_date', label: 'Date', type: 'date', required: true },
            { name: 'video_url', label: 'URL de la vidéo (YouTube)', type: 'text' },
        ] : [
            { name: 'title', label: 'Titre', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'event_date', label: 'Date', type: 'date', required: true },
            { name: 'event_time', label: 'Heure', type: 'time', required: true },
            { name: 'location', label: 'Lieu', type: 'text', required: true },
            { name: 'type', label: 'Type (Culte, Étude Biblique, etc.)', type: 'text' },
        ];

        return (
            <div className="admin-form-overlay">
                <div className="admin-form-modal">
                    <div className="admin-form-header">
                        <h3>{editingItem ? 'Modifier' : 'Ajouter'} {isSermon ? 'une Prédication' : 'un Événement'}</h3>
                        <button className="admin-form-close" onClick={() => { setShowForm(false); setEditingItem(null); }}>
                            <FaTimes />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="admin-form">
                        {fields.map((field) => (
                            <div key={field.name} className="admin-form-group">
                                <label>{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        required={field.required}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        required={field.required}
                                    />
                                )}
                            </div>
                        ))}
                        <button type="submit" className="admin-form-submit">
                            {editingItem ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // Render content based on active tab
    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return (
                    <div className="admin-stats">
                        <div className="admin-stat-card">
                            <FaMicrophone className="admin-stat-icon" />
                            <div>
                                <h3>{sermons.length}</h3>
                                <p>Prédications</p>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <FaCalendarAlt className="admin-stat-icon" />
                            <div>
                                <h3>{events.length}</h3>
                                <p>Événements</p>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <FaPray className="admin-stat-icon" />
                            <div>
                                <h3>{prayers.length}</h3>
                                <p>Demandes de prière</p>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <FaUsers className="admin-stat-icon" />
                            <div>
                                <h3>{prayers.filter(p => p.status === 'pending').length}</h3>
                                <p>En attente d'approbation</p>
                            </div>
                        </div>
                    </div>
                );

            case 'sermons':
                return (
                    <div className="admin-list">
                        <div className="admin-list-header">
                            <h3>Prédications</h3>
                            {user?.role === 'pastor' || user?.role === 'admin' ? (
                                <button className="admin-add-btn" onClick={() => { setEditingItem(null); setFormData({}); setShowForm(true); }}>
                                    <FaPlus /> Ajouter
                                </button>
                            ) : null}
                        </div>
                        {sermons.length === 0 ? (
                            <p className="admin-empty">Aucune prédication trouvée</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Prédicateur</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sermons.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{item.speaker || '-'}</td>
                                            <td>{formatDateForInput(item.sermon_date)}</td>
                                            <td className="admin-actions">
                                                {(user?.role === 'pastor' || user?.role === 'admin') && (
                                                    <>
                                                        <button 
                                                            className="admin-btn-edit"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button 
                                                            className="admin-btn-delete"
                                                            onClick={() => handleDelete('sermons', item.id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case 'events':
                return (
                    <div className="admin-list">
                        <div className="admin-list-header">
                            <h3>Événements</h3>
                            {user?.role === 'pastor' || user?.role === 'admin' ? (
                                <button className="admin-add-btn" onClick={() => { setEditingItem(null); setFormData({}); setShowForm(true); }}>
                                    <FaPlus /> Ajouter
                                </button>
                            ) : null}
                        </div>
                        {events.length === 0 ? (
                            <p className="admin-empty">Aucun événement trouvé</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Titre</th>
                                        <th>Date</th>
                                        <th>Lieu</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{formatDateForInput(item.event_date)}</td>
                                            <td>{item.location || '-'}</td>
                                            <td className="admin-actions">
                                                {(user?.role === 'pastor' || user?.role === 'admin') && (
                                                    <>
                                                        <button 
                                                            className="admin-btn-edit"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button 
                                                            className="admin-btn-delete"
                                                            onClick={() => handleDelete('events', item.id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case 'prayers':
                return (
                    <div className="admin-list">
                        <div className="admin-list-header">
                            <h3>Demandes de prière</h3>
                        </div>
                        {prayers.length === 0 ? (
                            <p className="admin-empty">Aucune demande de prière</p>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Demande</th>
                                        <th>Date</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prayers.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name || 'Anonyme'}</td>
                                            <td className="admin-prayer-text">{item.request.substring(0, 60)}...</td>
                                            <td>{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                                            <td>
                                                <span className={`admin-status admin-status-${item.status || 'pending'}`}>
                                                    {item.status === 'approved' ? 'Approuvé' : 
                                                     item.status === 'prayed' ? 'Prière faite' : 'En attente'}
                                                </span>
                                            </td>
                                            <td className="admin-actions">
                                                {user?.role === 'admin' && (
                                                    <>
                                                        {item.status !== 'approved' && (
                                                            <button 
                                                                className="admin-btn-approve"
                                                                onClick={() => handlePrayerStatus(item.id, 'approved')}
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                        )}
                                                        {item.status !== 'prayed' && (
                                                            <button 
                                                                className="admin-btn-pray"
                                                                onClick={() => handlePrayerStatus(item.id, 'prayed')}
                                                            >
                                                                <FaPray />
                                                            </button>
                                                        )}
                                                        <button 
                                                            className="admin-btn-delete"
                                                            onClick={() => handleDelete('prayer-requests', item.id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <FaChurch className="admin-sidebar-icon" />
                    <h2>Admin</h2>
                </div>
                <nav className="admin-nav">
                    <button 
                        className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <FaChurch /> Tableau de bord
                    </button>
                    <button 
                        className={`admin-nav-btn ${activeTab === 'sermons' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sermons')}
                    >
                        <FaMicrophone /> Prédications
                    </button>
                    <button 
                        className={`admin-nav-btn ${activeTab === 'events' ? 'active' : ''}`}
                        onClick={() => setActiveTab('events')}
                    >
                        <FaCalendarAlt /> Événements
                    </button>
                    <button 
                        className={`admin-nav-btn ${activeTab === 'prayers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prayers')}
                    >
                        <FaPray /> Prières
                    </button>
                </nav>
                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <FaUserCog />
                        <div>
                            <p className="admin-user-name">{user?.full_name || 'Admin'}</p>
                            <p className="admin-user-role">{user?.role === 'pastor' ? 'Pasteur' : 'Administrateur'}</p>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={onLogout}>
                        <FaSignOutAlt /> Déconnexion
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="admin-main">
                <div className="admin-main-header">
                    <h1>Tableau de bord</h1>
                    <p>Bienvenue, {user?.full_name || 'Administrateur'}</p>
                </div>
                <div className="admin-main-content">
                    {loading ? (
                        <div className="admin-loading">Chargement...</div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </div>

            {showForm && renderForm()}
        </div>
    );
}

export default AdminDashboard;