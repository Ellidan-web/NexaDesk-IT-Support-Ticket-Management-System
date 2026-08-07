import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import toast from 'react-hot-toast';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [updating, setUpdating] = useState(false);

    const isAdmin = user?.role === 'admin' || user?.role === 'staff';

    useEffect(() => {
        loadTicket();
        if (isAdmin) {
            loadUsers();
        }
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

    const loadUsers = async () => {
        const result = await ticketService.getAllUsers();
        if (result.success) {
            setUsers(result.data.users);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        const result = await ticketService.addComment(id, comment);
        if (result.success) {
            toast.success('Comment added!');
            setComments([...comments, result.data.comment]);
            setComment('');
            await loadTicket();
        } else {
            toast.error(result.error || 'Failed to add comment');
        }
        setSubmitting(false);
    };

    const handleStatusChange = async (newStatus) => {
        if (!window.confirm(`Change status to ${newStatus}?`)) return;

        setUpdating(true);
        const result = await ticketService.updateStatus(id, newStatus);
        if (result.success) {
            toast.success(`Status updated to ${newStatus}`);
            setTicket(result.data.ticket);
            await loadTicket();
        } else {
            toast.error(result.error || 'Failed to update status');
        }
        setUpdating(false);
    };

    const handlePriorityChange = async (newPriority) => {
        if (!window.confirm(`Change priority to ${newPriority}?`)) return;

        setUpdating(true);
        const result = await ticketService.updatePriority(id, newPriority);
        if (result.success) {
            toast.success(`Priority updated to ${newPriority}`);
            setTicket(result.data.ticket);
            await loadTicket();
        } else {
            toast.error(result.error || 'Failed to update priority');
        }
        setUpdating(false);
    };

    const handleAssignUser = async (assignedTo) => {
        setUpdating(true);
        const result = await ticketService.assignTicket(id, assignedTo);
        if (result.success) {
            toast.success('Ticket assigned successfully!');
            setTicket(result.data.ticket);
            await loadTicket();
        } else {
            toast.error(result.error || 'Failed to assign ticket');
        }
        setUpdating(false);
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
        <div className="min-h-screen bg-[#0F172A] pt-20">
            <div className="container mx-auto px-4 py-12">
                <button
                    onClick={() => isAdmin ? navigate('/admin/tickets') : navigate('/my-tickets')}
                    className="text-[#94A3B8] hover:text-[#F8FAFC] mb-6 inline-flex items-center"
                >
                    ← Back to {isAdmin ? 'All Tickets' : 'My Tickets'}
                </button>

                <div className="bg-[#1E293B] rounded-2xl shadow-xl p-8 mb-8 border border-[#334155]">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#F8FAFC]">{ticket.title}</h1>
                            <p className="text-[#94A3B8] mt-1">
                                #{ticket.id.slice(0, 8)} •
                                Created by {ticket.users?.name || 'Unknown'}
                                {isAdmin && ticket.users && (
                                    <span className="ml-2 text-sm text-[#94A3B8]">
                                        ({ticket.users?.email})
                                    </span>
                                )}
                            </p>
                        </div>

                        {isAdmin && (
                            <div className="bg-[#0F172A] rounded-xl p-4 w-full md:w-auto border border-[#334155]">
                                <p className="text-xs font-semibold text-[#94A3B8] uppercase mb-2">Admin Controls</p>
                                <div className="flex flex-wrap gap-3">
                                    <div>
                                        <label className="text-xs text-[#94A3B8] block mb-1">Status</label>
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-[#1E293B] text-[#F8FAFC] border border-[#475569]"
                                            disabled={updating}
                                        >
                                            {statuses.map((s) => (
                                                <option key={s} value={s} className="bg-[#1E293B] text-[#F8FAFC]">{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#94A3B8] block mb-1">Priority</label>
                                        <select
                                            value={ticket.priority}
                                            onChange={(e) => handlePriorityChange(e.target.value)}
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-[#1E293B] text-[#F8FAFC] border border-[#475569]"
                                            disabled={updating}
                                        >
                                            {priorities.map((p) => (
                                                <option key={p} value={p} className="bg-[#1E293B] text-[#F8FAFC]">{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#94A3B8] block mb-1">Assign To</label>
                                        <select
                                            value={ticket.assigned_to || ''}
                                            onChange={(e) => handleAssignUser(e.target.value || null)}
                                            className="px-3 py-1 rounded-full text-xs font-medium border border-[#475569] bg-[#1E293B] text-[#F8FAFC]"
                                            disabled={updating}
                                        >
                                            <option value="">Unassigned</option>
                                            {users.map((u) => (
                                                <option key={u.id} value={u.id} className="bg-[#1E293B] text-[#F8FAFC]">
                                                    {u.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isAdmin && (
                            <div className="flex gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#94A3B8]">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.status === 'OPEN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                        ticket.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            ticket.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#94A3B8]">Priority:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                        ticket.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                            ticket.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold text-[#F8FAFC]">Description</h3>
                        <p className="text-[#94A3B8] mt-2 whitespace-pre-wrap">{ticket.description}</p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-[#94A3B8]">Category</p>
                            <p className="font-medium text-[#F8FAFC]">{ticket.category}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#94A3B8]">Created</p>
                            <p className="font-medium text-[#F8FAFC]">
                                {new Date(ticket.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[#94A3B8]">Assigned To</p>
                            <p className="font-medium text-[#F8FAFC]">
                                {ticket.assigned_to ? 'Assigned' : 'Unassigned'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[#94A3B8]">Created By</p>
                            <p className="font-medium text-[#F8FAFC]">{ticket.users?.name || 'Unknown'}</p>
                        </div>
                    </div>

                    {ticket.assigned_to && ticket.assigned_users && (
                        <div className="mt-4 bg-green-900/30 rounded-xl p-4 border border-green-500/30">
                            <p className="text-sm text-green-400">
                                👤 Assigned to: <span className="font-semibold">{ticket.assigned_users?.name}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="bg-[#1E293B] rounded-2xl shadow-xl p-8 border border-[#334155]">
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-6">Comments</h3>

                    {/* Comments List */}
                    <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                        {comments.length === 0 ? (
                            <p className="text-[#94A3B8] text-center py-8">No comments yet</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className={`rounded-xl p-4 ${comment.user_id === user?.id
                                    ? 'bg-blue-900/20 border border-blue-500/30'
                                    : 'bg-[#0F172A] border border-[#334155]'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-semibold text-[#F8FAFC]">
                                                {comment.users?.name || 'Unknown'}
                                                {comment.user_id === user?.id && (
                                                    <span className="text-xs ml-2 text-nexa-accent">(You)</span>
                                                )}
                                                {isAdmin && comment.user_id !== user?.id && (
                                                    <span className="text-xs ml-2 text-orange-400">(Client)</span>
                                                )}
                                            </span>
                                            <span className="text-sm text-[#94A3B8] ml-2">
                                                {new Date(comment.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[#F8FAFC] mt-2">{comment.message}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Comment Input - Always at Bottom */}
                    <form onSubmit={handleAddComment} className="mt-4 border-t border-[#334155] pt-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-2 bg-[#0F172A] border border-[#475569] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                            />
                            <button
                                type="submit"
                                disabled={submitting || !comment.trim()}
                                className="px-6 py-2 bg-nexa-accent text-white rounded-lg font-semibold hover:bg-nexa-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </form>
                </div>
                {/* History Section */}
                {history.length > 0 && (
                    <div className="bg-[#1E293B] rounded-2xl shadow-xl p-8 mt-8 border border-[#334155]">
                        <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">History</h3>
                        <div className="space-y-2">
                            {history.map((entry) => (
                                <div key={entry.id} className="text-sm text-[#94A3B8] border-b border-[#334155] py-2">
                                    <span className="font-medium text-[#F8FAFC]">{entry.users?.name || 'System'}</span>
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