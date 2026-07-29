import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';

const AdminTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        priority: ''
    });

    useEffect(() => {
        loadAllTickets();
    }, []);

    const loadAllTickets = async () => {
        setLoading(true);
        const result = await ticketService.getAllTickets();
        if (result.success) {
            setTickets(result.data.tickets);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const clearFilters = () => {
        setFilters({ status: '', priority: '' });
    };

    const getStatusColor = (status) => {
        const colors = {
            'OPEN': 'bg-red-100 text-red-600',
            'IN_PROGRESS': 'bg-yellow-100 text-yellow-600',
            'RESOLVED': 'bg-green-100 text-green-600',
            'CLOSED': 'bg-gray-100 text-gray-600'
        };
        return colors[status] || 'bg-gray-100 text-gray-600';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'LOW': 'bg-blue-100 text-blue-600',
            'MEDIUM': 'bg-yellow-100 text-yellow-600',
            'HIGH': 'bg-orange-100 text-orange-600',
            'CRITICAL': 'bg-red-100 text-red-600'
        };
        return colors[priority] || 'bg-gray-100 text-gray-600';
    };

    const filteredTickets = tickets.filter(ticket => {
        if (filters.status && ticket.status !== filters.status) return false;
        if (filters.priority && ticket.priority !== filters.priority) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexa-accent mx-auto"></div>
                    <p className="mt-4 text-nexa-gray">Loading tickets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-nexa-light pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-nexa-primary">All Tickets</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-nexa-gray">Admin: {user?.name}</span>
                        <Link to="/admin" className="text-nexa-accent hover:underline">
                            ← Back to Admin
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-nexa-primary mb-1">Filter by Status</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-nexa-accent"
                            >
                                <option value="">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-nexa-primary mb-1">Filter by Priority</label>
                            <select
                                name="priority"
                                value={filters.priority}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-nexa-accent"
                            >
                                <option value="">All Priorities</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={clearFilters}
                        className="mt-4 text-sm text-nexa-accent hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {filteredTickets.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-nexa-gray">No tickets found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-nexa-light">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-nexa-gray uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-nexa-gray uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-nexa-gray uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-nexa-gray uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-nexa-gray uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-nexa-gray uppercase">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-nexa-gray uppercase">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-nexa-gray uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredTickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-nexa-light transition-colors">
                                            <td className="px-6 py-4 text-sm text-nexa-gray">#{ticket.id.slice(0, 8)}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-nexa-primary">
                                                {ticket.title}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-nexa-gray">{ticket.users?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-sm text-nexa-gray">{ticket.category}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-nexa-gray">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/tickets/${ticket.id}`}
                                                    className="text-nexa-accent hover:text-nexa-accent-light font-medium text-sm"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTickets;