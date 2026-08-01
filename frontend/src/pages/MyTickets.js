import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ticketService from '../services/ticketService';
import Pagination from '../components/Pagination';
import { SkeletonTicketList } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 20;

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/tickets/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    page: page,
                    limit: itemsPerPage,
                    search: searchTerm || undefined
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
            {/* Header with Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-white">My Tickets</h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                loadTickets(1);
                            }}
                            className="w-full sm:w-64 px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Link to="/create-ticket" className="btn-primary text-center">
                        + New Ticket
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {tickets.length === 0 ? (
                <EmptyState 
                    title="No tickets yet"
                    message="Create your first support ticket to get help."
                    buttonText="Create Ticket"
                    buttonLink="/create-ticket"
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
                        onPageChange={loadTickets}
                    />
                </>
            )}
        </div>
    </div>
);
};

export default MyTickets;