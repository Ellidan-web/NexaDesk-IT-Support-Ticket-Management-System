import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import logo from '../assets/logo.png'; // ← ADD THIS

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
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/tickets/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    page: 1,
                    limit: 100
                }
            });

            const tickets = response.data.tickets || [];
            setStats({
                total: tickets.length,
                open: tickets.filter(t => t.status === 'OPEN').length,
                inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
                resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0F172A] pt-20">
            <nav className="bg-[#0F172A] border-b border-[#334155] fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                        className="flex items-center space-x-3"
                    >
                        <img src={logo} alt="NexaDesk" className="h-10 w-auto" />
                        <span className="text-2xl font-bold text-[#F8FAFC]">Nexa<span className="text-nexa-accent">Desk</span></span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to="/my-tickets" className="text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors">My Tickets</Link>
                        <span className="text-[#94A3B8]">Welcome, {user?.name}</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 border-2 border-nexa-accent text-nexa-accent rounded-lg hover:bg-nexa-accent hover:text-white transition-all duration-300 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-[#F8FAFC]">Dashboard</h2>
                    <Link to="/create-ticket" className="px-6 py-3 bg-nexa-accent text-white rounded-lg font-semibold hover:bg-nexa-accent-light hover:scale-105 transition-all duration-300 shadow-lg shadow-nexa-accent/30">
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
                            <div className="bg-[#1E293B] rounded-2xl shadow-xl p-6 border border-[#334155]">
                                <h3 className="text-sm font-medium text-[#94A3B8]">Total Tickets</h3>
                                <p className="text-3xl font-bold text-[#F8FAFC] mt-2">{stats.total}</p>
                            </div>
                            <div className="bg-[#1E293B] rounded-2xl shadow-xl p-6 border border-[#334155]">
                                <h3 className="text-sm font-medium text-[#94A3B8]">Open</h3>
                                <p className="text-3xl font-bold text-red-400 mt-2">{stats.open}</p>
                            </div>
                            <div className="bg-[#1E293B] rounded-2xl shadow-xl p-6 border border-[#334155]">
                                <h3 className="text-sm font-medium text-[#94A3B8]">In Progress</h3>
                                <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.inProgress}</p>
                            </div>
                            <div className="bg-[#1E293B] rounded-2xl shadow-xl p-6 border border-[#334155]">
                                <h3 className="text-sm font-medium text-[#94A3B8]">Resolved</h3>
                                <p className="text-3xl font-bold text-green-400 mt-2">{stats.resolved}</p>
                            </div>
                        </div>

                        <div className="bg-[#1E293B] rounded-2xl shadow-xl p-8 text-center border border-[#334155]">
                            <p className="text-[#94A3B8] mb-4">Quick Actions</p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <Link to="/create-ticket" className="px-6 py-3 bg-nexa-accent text-white rounded-lg font-semibold hover:bg-nexa-accent-light hover:scale-105 transition-all duration-300 shadow-lg shadow-nexa-accent/30">
                                    Create Ticket
                                </Link>
                                <Link to="/my-tickets" className="px-6 py-3 bg-[#334155] text-[#F8FAFC] rounded-lg font-semibold hover:bg-[#475569] transition-all duration-300">
                                    View My Tickets
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;