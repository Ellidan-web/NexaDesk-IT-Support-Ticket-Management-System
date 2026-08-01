import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import { SkeletonTicketList } from '../components/Skeleton';

const AdminTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 20;
    const [filters, setFilters] = useState({
        status: '',
        priority: ''
    });

    useEffect(() => {
        loadAllTickets(1);
    }, []);

    const loadAllTickets = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/tickets/admin/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    page: page,
                    limit: itemsPerPage,
                    status: filters.status || undefined,
                    priority: filters.priority || undefined
                }
            });

            setTickets(response.data.tickets);
            setTotalPages(response.data.pagination.totalPages);
            setTotalItems(response.data.pagination.total);
            setCurrentPage(page);
            setError('');
        } catch (err) {
            setError('Failed to load tickets');
            console.error(err);
        }
        setLoading(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        loadAllTickets(1);
    };

    const clearFilters = () => {
        setFilters({ status: '', priority: '' });
        loadAllTickets(1);
    };

    const getStatusColor = (status) => {
        const statusUpper = status?.toString().toUpperCase().trim() || '';
        const colors = {
            'OPEN': 'bg-red-500/20 text-red-400 border border-red-500/30',
            'IN_PROGRESS': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            'RESOLVED': 'bg-green-500/20 text-green-400 border border-green-500/30',
            'CLOSED': 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        };
        return colors[statusUpper] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    };

    const getPriorityColor = (priority) => {
        const priorityUpper = priority?.toString().toUpperCase().trim() || '';
        const colors = {
            'LOW': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            'HIGH': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
            'CRITICAL': 'bg-red-500/20 text-red-400 border border-red-500/30'
        };
        return colors[priorityUpper] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 pt-20">
                <div className="container mx-auto px-4 py-12">
                    <SkeletonTicketList count={4} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">All Tickets</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-slate-400">Admin: {user?.name}</span>
                        <Link to="/admin" className="text-nexa-accent hover:text-nexa-accent-light">
                            ← Back to Admin
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Filters - Dark Theme */}
                <div className="bg-slate-800 rounded-2xl shadow-xl p-6 mb-8 border border-slate-700">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Filter by Status</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                            >
                                <option value="">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Filter by Priority</label>
                            <select
                                name="priority"
                                value={filters.priority}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
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
                        className="mt-4 text-sm text-nexa-accent hover:text-nexa-accent-light hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Tickets Table - Dark Theme */}
                <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
                    {tickets.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400">No tickets found</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Priority</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Created</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {tickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-slate-700/50 transition-colors duration-200">
                                                <td className="px-6 py-4 text-sm text-slate-400">#{ticket.id.slice(0, 8)}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-white">
                                                    {ticket.title}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400">{ticket.users?.name || 'Unknown'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-400">{ticket.category}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getPriorityColor(ticket.priority)}`}>
                                                        {ticket.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-400">
                                                    {new Date(ticket.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        to={`/tickets/${ticket.id}`}
                                                        className="text-nexa-accent hover:text-nexa-accent-light font-medium text-sm hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={loadAllTickets}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTickets;