import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-nexa-light pt-20">
            <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-nexa-primary">NexaDesk</h1>
                    <div className="flex items-center space-x-4">
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
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-nexa-primary mb-6">
                        Dashboard
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-nexa-light rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-nexa-primary">Total Tickets</h3>
                            <p className="text-3xl font-bold text-nexa-accent mt-2">0</p>
                        </div>
                        <div className="bg-nexa-light rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-nexa-primary">Open Tickets</h3>
                            <p className="text-3xl font-bold text-nexa-warning mt-2">0</p>
                        </div>
                        <div className="bg-nexa-light rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-nexa-primary">Resolved</h3>
                            <p className="text-3xl font-bold text-nexa-success mt-2">0</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;