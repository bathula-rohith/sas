import React, { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';

interface TwoFactorAuthModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ onClose, onSuccess }) => {
    const { primaryColor } = useSettingsStore();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleVerify = () => {
        // Mock verification: any 6-digit code is valid
        if (/^\d{6}$/.test(code)) {
            onSuccess();
        } else {
            setError('Please enter a valid 6-digit code.');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface p-6 rounded-lg w-full max-w-sm text-center shadow-2xl">
                <h3 className="text-xl font-bold mb-2 text-text-primary">Set up Two-Factor Authentication</h3>
                <p className="text-sm text-text-secondary mb-4">Scan the QR code with your authenticator app.</p>
                
                <div className="flex justify-center my-4">
                    {/* Mock QR Code */}
                    <svg width="160" height="160" viewBox="0 0 100 100" className="bg-white p-2 rounded-md">
                        <path d="M0 0h20v20H0z M80 0h20v20H80z M0 80h20v20H0z M30 0h10v10H30z M50 0h10v10H50z M70 0h10v10H70z M0 30h10v10H0z M0 50h10v10H0z M0 70h10v10H0z M30 80h10v10H30z M50 80h10v10H50z M70 80h10v10H70z M80 30h10v10H80z M80 50h10v10H80z M80 70h10v10H80z M20 20h10v10H20z M40 20h10v10H40z M60 20h10v10H60z M20 40h10v10H20z M20 60h10v10H20z M40 60h10v10H40z M60 40h10v10H60z M60 60h10v10H60z M40 40h10v10H40z M30 30h5v5h-5z M50 30h5v5h-5z M30 50h5v5h-5z M50 50h5v5h-5z" fill="black"/>
                    </svg>
                </div>
                
                <p className="text-sm text-text-secondary mb-4">Then, enter the 6-digit code from your app.</p>

                <input 
                    type="text"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        setError('');
                    }}
                    maxLength={6}
                    placeholder="123456"
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-center tracking-[0.5em] font-mono text-lg"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                
                <div className="flex justify-end space-x-3 pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-sm font-medium">Cancel</button>
                    <button type="button" onClick={handleVerify} style={{backgroundColor: primaryColor}} className="px-4 py-2 rounded text-white text-sm font-medium">Verify & Enable</button>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuthModal;