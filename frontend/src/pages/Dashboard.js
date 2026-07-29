import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const result = await ticketService.getUserTickets();
        if (result.success) {
            const tickets = result.data.tickets || [];
            setStats({
                total: tickets.length,
                open: tickets.filter(t => t.status === 'OPEN').length,
                inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
                resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-nexa-light pt-20">
            <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-nexa-primary">NexaDesk</h1>
                    <div className="flex items-center space-x-4">
                        <Link to="/my-tickets" className="text-nexa-primary hover:text-nexa-accent font-medium">My Tickets</Link>
                        <span className="text-nexa-gray">Welcome, {user?.name}</span>
                        <button
                            onClick={logout}
                            className="btn-outline text-sm px-4 py-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-nexa-primary">Dashboard</h2>
                    <Link to="/create-ticket" className="btn-primary">
                        + New Ticket
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexa-accent"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <p className="text-nexa-gray mb-4">Quick Actions</p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <Link to="/create-ticket" className="btn-primary">Create Ticket</Link>
                                <Link to="/my-tickets" className="btn-secondary">View My Tickets</Link>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;