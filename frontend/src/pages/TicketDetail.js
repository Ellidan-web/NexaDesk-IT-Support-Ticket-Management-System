import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        loadTicket();
    }, [id]);

    const loadTicket = async () => {
        setLoading(true);
        const result = await ticketService.getTicketById(id);
        if (result.success) {
            setTicket(result.data.ticket);
            setComments(result.data.comments);
            setHistory(result.data.history);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        const result = await ticketService.addComment(id, comment);
        if (result.success) {
            setComments([...comments, result.data.comment]);
            setComment('');
            await loadTicket();
        } else {
            alert(result.error);
        }
        setSubmitting(false);
    };

    const handleStatusChange = async (newStatus) => {
        if (!window.confirm(`Change status to ${newStatus}?`)) return;

        setUpdatingStatus(true);
        const result = await ticketService.updateStatus(id, newStatus);
        if (result.success) {
            setTicket(result.data.ticket);
            await loadTicket();
        } else {
            alert(result.error);
        }
        setUpdatingStatus(false);
    };

    const handlePriorityChange = async (newPriority) => {
        if (!window.confirm(`Change priority to ${newPriority}?`)) return;

        setUpdatingStatus(true);
        const result = await ticketService.updatePriority(id, newPriority);
        if (result.success) {
            setTicket(result.data.ticket);
            await loadTicket();
        } else {
            alert(result.error);
        }
        setUpdatingStatus(false);
    };

    const getStatusColor = (status) => {
        const colors = {
            'OPEN': 'bg-red-100 text-red-600',
            'IN_PROGRESS': 'bg-yellow-100 text-yellow-600',
            'RESOLVED': 'bg-green-100 text-green-600',
            'CLOSED': 'bg-gray-100 text-gray-600'
        };
        return colors[status] || 'bg-gray-100 text-gray-600';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'LOW': 'bg-blue-100 text-blue-600',
            'MEDIUM': 'bg-yellow-100 text-yellow-600',
            'HIGH': 'bg-orange-100 text-orange-600',
            'CRITICAL': 'bg-red-100 text-red-600'
        };
        return colors[priority] || 'bg-gray-100 text-gray-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexa-accent mx-auto"></div>
                    <p className="mt-4 text-nexa-gray">Loading ticket...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-nexa-primary mb-2">Error</h3>
                    <p className="text-nexa-gray">{error}</p>
                    <button onClick={() => navigate('/my-tickets')} className="btn-primary mt-4">
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    return (
        <div className="min-h-screen bg-nexa-light pt-20">
            <div className="container mx-auto px-4 py-12">
                <button
                    onClick={() => navigate('/my-tickets')}
                    className="text-nexa-gray hover:text-nexa-primary mb-6 inline-flex items-center"
                >
                    ← Back to Tickets
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-nexa-primary">{ticket.title}</h1>
                            <p className="text-nexa-gray mt-1">#{ticket.id.slice(0, 8)} • Created by {ticket.users?.name || 'Unknown'}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-nexa-gray">Status:</span>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(ticket.status)}`}
                                    disabled={updatingStatus}
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-nexa-gray">Priority:</span>
                                <select
                                    value={ticket.priority}
                                    onChange={(e) => handlePriorityChange(e.target.value)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getPriorityColor(ticket.priority)}`}
                                    disabled={updatingStatus}
                                >
                                    {priorities.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold text-nexa-primary">Description</h3>
                        <p className="text-nexa-gray mt-2 whitespace-pre-wrap">{ticket.description}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-nexa-gray">Category</p>
                            <p className="font-medium text-nexa-primary">{ticket.category}</p>
                        </div>
                        <div>
                            <p className="text-sm text-nexa-gray">Created</p>
                            <p className="font-medium text-nexa-primary">
                                {new Date(ticket.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-nexa-gray">Assigned To</p>
                            <p className="font-medium text-nexa-primary">
                                {ticket.assigned_to || 'Unassigned'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-nexa-gray">Created By</p>
                            <p className="font-medium text-nexa-primary">{ticket.users?.name || 'Unknown'}</p>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-xl font-bold text-nexa-primary mb-6">Comments</h3>

                    <form onSubmit={handleAddComment} className="mb-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                            />
                            <button
                                type="submit"
                                disabled={submitting || !comment.trim()}
                                className="btn-primary px-6 py-2"
                            >
                                {submitting ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </form>

                    {comments.length === 0 ? (
                        <p className="text-nexa-gray text-center py-8">No comments yet</p>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-nexa-light rounded-xl p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-semibold text-nexa-primary">
                                                {comment.users?.name || 'Unknown'}
                                            </span>
                                            <span className="text-sm text-nexa-gray ml-2">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-nexa-gray mt-2">{comment.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* History Section */}
                {history.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
                        <h3 className="text-xl font-bold text-nexa-primary mb-4">History</h3>
                        <div className="space-y-2">
                            {history.map((entry) => (
                                <div key={entry.id} className="text-sm text-nexa-gray border-b border-gray-100 py-2">
                                    <span className="font-medium">{entry.users?.name || 'System'}</span>
                                    <span className="mx-2">→</span>
                                    <span>{entry.action}</span>
                                    <span className="ml-2 text-xs">
                                        {new Date(entry.created_at).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketDetail;