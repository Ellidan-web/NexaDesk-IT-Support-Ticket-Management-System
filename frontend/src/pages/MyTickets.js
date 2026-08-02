import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../components/Pagination';
import { SkeletonTicketList } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState({
        status: '',
        priority: ''
    });
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const itemsPerPage = 20;

    const loadTickets = useCallback(async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const params = {
                page,
                limit: itemsPerPage,
                sortBy: sortBy,
                sortOrder: sortOrder
            };

            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;

            const response = await axios.get(`http://localhost:5000/api/tickets/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params
            });

            let tickets = response.data.tickets || [];

            if (sortBy === 'priority' && sortOrder === 'desc') {
                const priorityOrder = { 'CRITICAL': 1, 'HIGH': 2, 'MEDIUM': 3, 'LOW': 4 };
                tickets = tickets.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            } else if (sortBy === 'priority' && sortOrder === 'asc') {
                const priorityOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
                tickets = tickets.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            } else if (sortBy === 'status') {
                const statusOrder = { 'OPEN': 1, 'IN_PROGRESS': 2, 'RESOLVED': 3, 'CLOSED': 4 };
                tickets = tickets.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            }

            setTickets(tickets);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalItems(response.data.pagination?.total || 0);
            setCurrentPage(page);
        } catch (err) {
            const errorMsg = 'Failed to load tickets. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
            console.error('Error loading tickets:', err);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }, [filters, sortBy, sortOrder]);

    useEffect(() => {
        loadTickets(1);
    }, [loadTickets]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePageChange = (page) => {
        loadTickets(page);
    };

    const clearFilters = () => {
        setFilters({ status: '', priority: '' });
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
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">My Tickets</h1>
                    </div>
                    <SkeletonTicketList count={4} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-white">My Tickets</h1>
                    <Link to="/create-ticket" className="btn-primary text-center">
                        + New Ticket
                    </Link>
                </div>

                <div className="bg-slate-800 rounded-2xl shadow-xl p-6 mb-8 border border-slate-700">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
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
                            <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
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

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Sort by</label>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                                    setSortBy(newSortBy);
                                    setSortOrder(newSortOrder);
                                    loadTickets(1);
                                }}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                            >
                                <option value="created_at-desc">Newest First</option>
                                <option value="created_at-asc">Oldest First</option>
                                <option value="priority-desc">Highest Priority</option>
                                <option value="priority-asc">Lowest Priority</option>
                                <option value="status-asc">Status Order</option>
                            </select>
                        </div>
                    </div>

                    {(filters.status || filters.priority) && (
                        <div className="mt-4 flex items-center gap-4">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-nexa-accent hover:text-nexa-accent-light hover:underline transition-colors"
                            >
                                Clear All Filters
                            </button>
                            <div className="flex flex-wrap gap-2">
                                {filters.status && (
                                    <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-full border border-slate-600">
                                        Status: {filters.status.replace('_', ' ')}
                                    </span>
                                )}
                                {filters.priority && (
                                    <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-full border border-slate-600">
                                        Priority: {filters.priority}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={() => loadTickets(currentPage)}
                            className="text-red-400 hover:text-red-300 underline text-sm"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {tickets.length === 0 ? (
                    <EmptyState
                        title="No tickets found"
                        message={filters.status || filters.priority ?
                            "No tickets match your filters. Try adjusting your search criteria." :
                            "Create your first support ticket to get help."}
                        buttonText={filters.status || filters.priority ? "Clear Filters" : "Create Ticket"}
                        buttonLink={filters.status || filters.priority ? null : "/create-ticket"}
                        onButtonClick={filters.status || filters.priority ? clearFilters : null}
                        icon="🎫"
                    />
                ) : (
                    <>
                        <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Priority</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {tickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-slate-700/50 transition-colors duration-200">
                                                <td className="px-6 py-4 text-sm text-slate-400">#{ticket.id.slice(0, 8)}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-white">
                                                    {ticket.title}
                                                </td>
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
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default MyTickets;