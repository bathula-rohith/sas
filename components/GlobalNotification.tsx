import React, { useState, useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';

const GlobalNotification: React.FC = () => {
    const { message, type, hideNotification } = useNotificationStore();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                // Allow time for fade-out animation before calling onClose
                setTimeout(hideNotification, 300);
            }, 4000); // Increased duration to 4 seconds
            return () => clearTimeout(timer);
        }
    }, [message, hideNotification]);

    if (!message) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
    const icon = isSuccess ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div 
            className={`fixed top-5 right-5 z-[100] transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
        >
            <div className={`${bgColor} text-white font-semibold py-2 px-4 rounded-md shadow-lg flex items-center`}>
                {icon}
                <span>{message}</span>
            </div>
        </div>
    );
};

export default GlobalNotification;