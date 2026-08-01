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
    const { darkMode, toggleDarkMode } = useTheme(); // ← ADD THIS

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3">
                    <img src={logo} alt="NexaDesk" className="h-10 w-auto" />
                    <span className="text-2xl font-bold text-nexa-primary">Nexa<span className="text-nexa-accent">Desk</span></span>
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-nexa-primary hover:text-nexa-accent font-medium">
                                    Admin
                                </Link>
                            )}
                            <Link to="/my-tickets" className="text-nexa-primary hover:text-nexa-accent font-medium">My Tickets</Link>
                            <span className="text-nexa-gray">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="btn-outline text-sm px-4 py-2"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-nexa-primary hover:text-nexa-accent font-medium">Sign In</Link>
                            <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
                        </>
                    )}
                    
                    {/* Dark Mode Toggle - MOVED INSIDE the div */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-nexa-light dark:hover:bg-nexa-secondary transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-nexa-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}

// Home page component
function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-nexa-light via-white to-blue-50 pt-20">
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl font-bold text-nexa-primary mb-6">
                        Streamline IT Support<br />
                        <span className="text-nexa-accent">For Modern Teams</span>
                    </h1>
                    <p className="text-xl text-nexa-gray mb-8">
                        A complete ticket management system designed to help your team
                        track, prioritize, and resolve issues efficiently.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="btn-primary text-lg px-8 py-3">Get Started</Link>
                        <Link to="/login" className="btn-outline text-lg px-8 py-3">Sign In</Link>
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