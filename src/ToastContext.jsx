import { createContext, useContext, useState, useCallback, useRef } from "react";
import "./Toast.css";

const ToastContext = createContext();

const ICONS = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
};

const TITLES = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [confirmState, setConfirmState] = useState(null);
    const resolveRef = useRef(null);

    // Show a toast notification
    const toast = useCallback((message, type = "info", duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration, exiting: false }]);

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
            );
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 300);
        }, duration);
    }, []);

    // Remove a toast manually
    const removeToast = useCallback((id) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
    }, []);

    // Show a modern confirm dialog — returns a Promise<boolean>
    const confirm = useCallback((message, title = "Are you sure?", variant = "danger") => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setConfirmState({ message, title, variant });
        });
    }, []);

    const handleConfirm = (result) => {
        setConfirmState(null);
        if (resolveRef.current) {
            resolveRef.current(result);
            resolveRef.current = null;
        }
    };

    return (
        <ToastContext.Provider value={{ toast, confirm }}>
            {children}

            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`toast toast-${t.type}${t.exiting ? " exiting" : ""}`}
                    >
                        <span className="toast-icon">{ICONS[t.type]}</span>
                        <div className="toast-content">
                            <div className="toast-title">{TITLES[t.type]}</div>
                            <div className="toast-message">{t.message}</div>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(t.id)}>
                            ✕
                        </button>
                        <div
                            className="toast-progress"
                            style={{ animationDuration: `${t.duration}ms` }}
                        />
                    </div>
                ))}
            </div>

            {/* Confirm Dialog */}
            {confirmState && (
                <div className="confirm-overlay" onClick={() => handleConfirm(false)}>
                    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <span className="confirm-icon">
                            {confirmState.variant === "danger" ? "🗑️" : "❓"}
                        </span>
                        <div className="confirm-title">{confirmState.title}</div>
                        <div className="confirm-message">{confirmState.message}</div>
                        <div className="confirm-buttons">
                            <button
                                className="confirm-btn-cancel"
                                onClick={() => handleConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`confirm-btn-confirm ${confirmState.variant}`}
                                onClick={() => handleConfirm(true)}
                            >
                                {confirmState.variant === "danger" ? "Delete" : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
