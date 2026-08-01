import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext'; // ← KEEP THIS
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminTickets from './pages/AdminTickets';

// Import logo
import logo from './assets/logo.png';

// Navbar component with auth state
function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-[#0F172A] border-b border-[#334155] fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3">
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

function Home() {
    return (
        <div className="min-h-screen bg-[#0F172A] pt-20">
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl font-bold text-[#F8FAFC] mb-6">
                        Streamline IT Support<br />
                        <span className="text-nexa-accent">For Modern Teams</span>
                    </h1>
                    <p className="text-xl text-[#94A3B8] mb-8">
                        A complete ticket management system designed to help your team
                        track, prioritize, and resolve issues efficiently.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="px-6 py-3 bg-nexa-accent text-white rounded-lg font-semibold hover:bg-nexa-accent-light hover:scale-105 transition-all duration-300 shadow-lg shadow-nexa-accent/30">
                            Get Started
                        </Link>
                        <Link to="/login" className="px-6 py-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg font-semibold border-2 border-[#334155] hover:border-nexa-accent hover:bg-nexa-accent/5 transition-all duration-300">
                            Sign In
                        </Link>
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
                <Routes>
                    <Route path="/" element={
                        <>
                            <Navbar />
                            <Home />
                        </>
                    } />
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
            </AuthProvider>
        </Router>
    );
}

export default App;