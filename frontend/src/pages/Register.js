import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await register(name, email, password);
        
        if (result.success) {
            toast.success('Account created successfully! 🎉');
            navigate('/dashboard');
        } else {
            toast.error(result.error || 'Registration failed');
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4 pt-20 pb-12">
            <div className="max-w-md w-full bg-[#1E293B] p-8 rounded-2xl shadow-xl border border-[#334155] mt-8">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-[#F8FAFC]">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-[#94A3B8]">
                        Or{' '}
                        <Link to="/login" className="font-medium text-nexa-accent hover:text-nexa-accent-light">
                            sign in to your account
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#94A3B8]">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#0F172A] border border-[#475569] rounded-lg shadow-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#94A3B8]">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#0F172A] border border-[#475569] rounded-lg shadow-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#94A3B8]">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#0F172A] border border-[#475569] rounded-lg shadow-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                                placeholder="At least 6 characters"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#94A3B8]">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-[#0F172A] border border-[#475569] rounded-lg shadow-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-nexa-accent hover:bg-nexa-accent-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexa-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;