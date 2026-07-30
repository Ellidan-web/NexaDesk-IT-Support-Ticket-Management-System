import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
    title = 'No tickets yet', 
    message = 'Create your first support ticket to get started.',
    buttonText = 'Create Ticket',
    buttonLink = '/create-ticket',
    icon = '🎫'
}) => {
    return (
        <div className="text-center py-16">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-2xl font-bold text-nexa-primary mb-2">{title}</h3>
            <p className="text-nexa-gray mb-6 max-w-md mx-auto">{message}</p>
            <Link to={buttonLink} className="btn-primary">
                {buttonText}
            </Link>
        </div>
    );
};

export default EmptyState;