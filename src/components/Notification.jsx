import { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return isVisible ? (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <span>{message}</span>
        <button onClick={() => setIsVisible(false)}>✕</button>
      </div>
    </div>
  ) : null;
};

export default Notification;