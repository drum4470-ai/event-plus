// components/ErrorMessage.jsx
import React from 'react';

export default function ErrorMessage({ message, isSimilar }) {
    if (!message) return null;

    return (
        <p className={`text-xs mt-2 ml-1 font-medium transition-all ${
            isSimilar ? 'text-orange-600 animate-pulse' : 'text-red-500'
        }`}>
            {isSimilar ? '⚠️' : '❌'} {message}
        </p>
    );
}