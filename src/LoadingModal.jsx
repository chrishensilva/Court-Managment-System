import "./LoadingModal.css";

function LoadingModal({ message = "Processing...", subMessage = "Please wait" }) {
    return (
        <div className="loading-modal">
            <div className="loading-content">
                <div className="loading-spinner"></div>
                <h3>{message}</h3>
                <p>{subMessage}</p>
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}

export default LoadingModal;
