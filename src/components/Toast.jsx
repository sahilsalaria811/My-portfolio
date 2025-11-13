/**
 * Toast notification component for user feedback
 * Supports success, error, and info types
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

let toastId = 0;
const toasts = [];
let setToastsState = null;

export const showToast = (message, type = 'info', duration = 3000) => {
    const id = toastId++;
    const toast = { id, message, type, duration };

    toasts.push(toast);
    if (setToastsState) {
        setToastsState([...toasts]);
    }

    // Auto remove after duration
    setTimeout(() => {
        removeToast(id);
    }, duration);

    return id;
};

export const removeToast = (id) => {
    const index = toasts.findIndex(t => t.id === id);
    if (index > -1) {
        toasts.splice(index, 1);
        if (setToastsState) {
            setToastsState([...toasts]);
        }
    }
};

const ToastContainer = () => {
    const [toastList, setToastList] = useState([]);

    useEffect(() => {
        setToastsState = setToastList;
        setToastList([...toasts]);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300';
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            <AnimatePresence>
                {toastList.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className={`glass-card border ${getStyles(toast.type)} p-4 rounded-lg shadow-lg flex items-start space-x-3`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(toast.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            aria-label="Close toast"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;

