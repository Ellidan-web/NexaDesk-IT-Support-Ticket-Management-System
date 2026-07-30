import React from 'react';

const Spinner = ({ size = 'md', color = 'nexa-accent' }) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16'
    };

    const sizeClass = sizes[size] || sizes.md;

    return (
        <div className="flex items-center justify-center">
            <div 
                className={`${sizeClass} animate-spin rounded-full border-4 border-${color}/20 border-t-${color}`}
                role="status"
                aria-label="Loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;