import React, { useEffect } from 'react';
import { CheckCheck, Info, AlertTriangle } from 'lucide-react';

/**
 * Auto-dismissing toast notification.
 */
export default function ToastNotification({ message, type = 'success', onDismiss }) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 2500);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const Icon = type === 'success' ? CheckCheck : type === 'error' ? AlertTriangle : Info;

    return (
        <div className={`toast-notification animate-pop toast-${type}`}>
            <Icon size={16} />
            <span>{message}</span>
        </div>
    );
}
