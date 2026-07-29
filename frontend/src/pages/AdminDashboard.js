import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        critical: 0,
        high: 0
    });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        setLoading(true);
        const result = await ticketService.getAllTickets();
        if (result.success) {
            const tickets = result.data.tickets || [];
            setRecentTickets(tickets.slice(0, 5));
            setStats({
                total: tickets.length,
                open: tickets.filter(t => t.status === 'OPEN').length,
                inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
                resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
                critical: tickets.filter(t => t.priority === 'CRITICAL').length,
                high: tickets.filter(t => t.priority === 'HIGH').length
            });
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexa-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-nexa-light pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-nexa-primary">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-nexa-gray">Welcome, {user?.name} (Admin)</span>
                        <Link to="/admin/tickets" className="btn-primary">
                            Manage All Tickets
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-sm font-medium text-nexa-gray">Total Tickets</h3>
                        <p className="text-3xl font-bold text-nexa-primary mt-2">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-sm font-medium text-nexa-gray">Open</h3>
                        <p className="text-3xl font-bold text-red-500 mt-2">{stats.open}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-sm font-medium text-nexa-gray">In Progress</h3>
                        <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.inProgress}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-sm font-medium text-nexa-gray">Resolved</h3>
                        <p className="text-3xl font-bold text-green-500 mt-2">{stats.resolved}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-sm font-medium text-nexa-gray">Critical</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">{stats.critical}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-nexa-primary">Recent Tickets</h2>
                        <Link to="/admin/tickets" className="text-nexa-accent hover:underline">
                            View All →
                        </Link>
                    </div>
                    
                    {recentTickets.length === 0 ? (
                        <p className="text-nexa-gray text-center py-8">No tickets yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-nexa-light">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-nexa-gray">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-nexa-gray">Title</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-nexa-gray">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-nexa-gray">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-nexa-gray">Priority</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-nexa-gray">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTickets.map((ticket) => (
                                        <tr key={ticket.id} className="border-t hover:bg-nexa-light">
                                            <td className="px-4 py-3 text-sm text-nexa-gray">#{ticket.id.slice(0, 8)}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-nexa-primary">{ticket.title}</td>
                                            <td className="px-4 py-3 text-sm text-nexa-gray">{ticket.users?.name || 'Unknown'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                    ticket.status === 'OPEN' ? 'bg-red-100 text-red-600' :
                                                    ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-600' :
                                                    ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                    ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                                                    ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                                    ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link to={`/tickets/${ticket.id}`} className="text-nexa-accent hover:underline text-sm">
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

export default AdminDashboard;