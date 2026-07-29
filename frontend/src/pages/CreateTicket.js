import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import ticketService from '../services/ticketService';

const CreateTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError('');
        const result = await ticketService.createTicket(formData);
        if (result.success) {
            navigate('/my-tickets');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-nexa-light pt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-nexa-primary mb-6">Create New Ticket</h1>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <TicketForm onSubmit={handleSubmit} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTicket;