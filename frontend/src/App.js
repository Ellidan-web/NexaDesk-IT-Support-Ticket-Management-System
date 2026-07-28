import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Import logo
import logo from './assets/logo.png';

// Navbar component with auth state
function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

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
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;