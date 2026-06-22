import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon" size={20} />;
      default:
        return <Info className="toast-icon" size={20} />;
    }
  };

  return (
    <div className={`toast ${type}`}>
      {getIcon()}
      <span className="toast-message">{message}</span>
      <button 
        onClick={onClose} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'inherit', 
          cursor: 'pointer', 
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
