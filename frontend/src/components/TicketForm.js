import React, { useState } from 'react';

const TicketForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        priority: 'MEDIUM'
    });

    const categories = ['General', 'Hardware', 'Software', 'Network', 'Email', 'Other'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-nexa-primary">
                    Title *
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief title of the issue"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-nexa-primary">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of the issue"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-nexa-primary">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-nexa-primary">
                    Priority
                </label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-nexa-accent focus:border-nexa-accent"
                >
                    {priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-nexa-accent hover:bg-nexa-accent-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nexa-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Creating...' : 'Create Ticket'}
            </button>
        </form>
    );
};

export default TicketForm;