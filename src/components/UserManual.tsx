import { USAGE_EXAMPLES } from '@/data/usage-examples';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './UserManual.css';
import UserVoicesMarquee from './UserVoicesMarquee';
import UserVoicesCarousel from './UserVoicesCarousel';

interface UserManualProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManual: React.FC<UserManualProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div className="user-manual-overlay" onClick={onClose}>
      <div className="user-manual-modal" onClick={handleModalClick}>
        <div className="user-manual-header">
          <h2 className="user-manual-title">取扱説明書</h2>
          <button
            type="button"
            className="user-manual-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="user-manual-content">
          <div className="user-manual-list-section">
            <h2 className="user-manual-subtitle">個人の感想</h2>
            <div className="border my-6  border-gray-300 rounded-md p-2">
              <UserVoicesCarousel
                intervalMs={3000}
                pauseOnHover
                orientation="vertical"
                containerHeight="100px"
                showControls={false}
              />
            </div>
          </div>

          <div className="user-manual-list-section">
            <h3 className="user-manual-subtitle">活用例</h3>
            <div className="user-manual-examples">
              {USAGE_EXAMPLES.map((example, index) => (
                <div key={index} className="user-manual-example">
                  <h4 className="user-manual-example-title">{example.title}</h4>
                  <p className="user-manual-example-description">
                    {example.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default UserManual;
