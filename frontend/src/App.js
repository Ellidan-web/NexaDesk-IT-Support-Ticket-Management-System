import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminTickets from './pages/AdminTickets';
import { Toaster } from 'react-hot-toast';

// Import logo
import logo from './assets/logo.png';

// Navbar component with auth state
function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-[#0F172A] border-b border-[#334155] fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/'}
                    className="flex items-center space-x-3"
                >
                    <img src={logo} alt="NexaDesk" className="h-10 w-auto" />
                    <span className="text-2xl font-bold text-[#F8FAFC]">Nexa<span className="text-nexa-accent">Desk</span></span>
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors">
                                    Admin
                                </Link>
                            )}
                            <Link to="/my-tickets" className="text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors">My Tickets</Link>
                            <span className="text-[#94A3B8]">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 border-2 border-nexa-accent text-nexa-accent rounded-lg hover:bg-nexa-accent hover:text-white transition-all duration-300 font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-[#94A3B8] hover:text-[#F8FAFC] font-medium transition-colors">Sign In</Link>
                            <Link to="/register" className="px-6 py-3 bg-nexa-accent text-white rounded-lg font-semibold hover:bg-nexa-accent-light hover:scale-105 transition-all duration-300 shadow-lg shadow-nexa-accent/30">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

// Home page component
function Home() {
    return (
        <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden fixed inset-0">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-nexa-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-nexa-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex items-center justify-center h-full">
                <div className="w-full max-w-4xl mx-auto text-center translate-y-6 md:translate-y-8">
                    <div className="inline-flex items-center gap-2 bg-nexa-accent/10 text-nexa-accent px-4 py-1.5 rounded-full text-xs font-medium border border-nexa-accent/20 mb-5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexa-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-nexa-accent"></span>
                        </span>
                        IT Help Desk Platform
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] mb-3">
                        Streamline IT Support
                        <br />
                        <span className="text-nexa-accent">For Modern Teams</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
                        A complete ticket management system designed to help your team
                        track, prioritize, and resolve issues efficiently.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 bg-nexa-accent hover:bg-nexa-accent-light text-white font-bold text-lg px-8 py-3.5 rounded-xl shadow-lg shadow-nexa-accent/30 hover:shadow-xl hover:shadow-nexa-accent/50 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Get Started
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg px-8 py-3.5 rounded-xl border-2 border-slate-600 hover:border-nexa-accent/30 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Sign In
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-nexa-accent/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-nexa-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-nexa-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-1">Smart Tickets</h3>
                            <p className="text-xs text-slate-400">Track with priority & status</p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-nexa-accent/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-nexa-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-nexa-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-1">Collaboration</h3>
                            <p className="text-xs text-slate-400">Assign & comment on tickets</p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-nexa-accent/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-nexa-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-nexa-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-1">Analytics</h3>
                            <p className="text-xs text-slate-400">Track response & resolution</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main App component
function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

// Separate component to use auth context inside Router
function AppContent() {
    const { user, isAuthenticated } = useAuth();

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1E293B',
                        color: '#F8FAFC',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '16px',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#F8FAFC',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#F8FAFC',
                        },
                    },
                }}
            />
            <Routes>
                <Route 
                    path="/" 
                    element={
                        isAuthenticated ? (
                            <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
                        ) : (
                            <>
                                <Navbar />
                                <Home />
                            </>
                        )
                    } 
                />
                <Route path="/login" element={
                    <>
                        <Navbar />
                        <Login />
                    </>
                } />
                <Route path="/register" element={
                    <>
                        <Navbar />
                        <Register />
                    </>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/my-tickets" element={
                    <ProtectedRoute>
                        <>
                            <Navbar />
                            <MyTickets />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/create-ticket" element={
                    <ProtectedRoute>
                        <>
                            <Navbar />
                            <CreateTicket />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/tickets/:id" element={
                    <ProtectedRoute>
                        <>
                            <Navbar />
                            <TicketDetail />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <>
                            <Navbar />
                            <AdminDashboard />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/admin/tickets" element={
                    <ProtectedRoute>
                        <>
                            <Navbar />
                            <AdminTickets />
                        </>
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

export default App;