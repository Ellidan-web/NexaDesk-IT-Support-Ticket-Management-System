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
    const itemsPerPage = 5;
    const [filters, setFilters] = useState({
        status: '',
        priority: ''
    });

    useEffect(() => {
        loadAllTickets(1);
    }, [filters.status, filters.priority]); // Re-fetch when filters change

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
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
        setCurrentPage(1); // Reset to first page on filter change
    };

    const clearFilters = () => {
        setFilters({ status: '', priority: '' });
        setCurrentPage(1);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-nexa-light pt-20">
                <div className="container mx-auto px-4 py-12">
                    <SkeletonTicketList count={4} />
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

                {/* Filters */}
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

                {/* Tickets Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {tickets.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-nexa-gray">No tickets found</p>
                        </div>
                    ) : (
                        <>
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
                                        {tickets.map((ticket) => (
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

                            {/* Pagination - INSIDE the return */}
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