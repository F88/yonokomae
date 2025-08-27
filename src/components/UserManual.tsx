import { USAGE_EXAMPLES } from '@/data/usage-examples';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import UserVoicesCarousel from './UserVoicesCarousel';

interface UserManualProps {
  isOpen: boolean;
  onClose: () => void;
  modalHeight?: string;
}

export const UserManual: React.FC<UserManualProps> = ({
  isOpen,
  onClose,
  modalHeight = '80vh',
}) => {
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
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-10 sm:p-5 overflow-y-auto animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-3xl sm:w-[95%] max-h-[calc(100vh-80px)] sm:max-h-[calc(100vh-40px)] flex flex-col animate-in zoom-in-95 duration-300 z-[10000]"
        onClick={handleModalClick}
        style={{ height: modalHeight }}
      >
        <div className="relative p-6 sm:p-5 border-b border-border text-center">
          <h2 className="text-2xl font-semibold text-foreground">取扱説明書</h2>
          <button
            type="button"
            className="absolute top-4 right-4 sm:top-3 sm:right-3 bg-background border-2 border-border rounded-full text-xl cursor-pointer w-10 h-10 flex items-center justify-center text-muted-foreground transition-all duration-200 font-bold hover:bg-muted hover:border-muted-foreground hover:text-foreground hover:rotate-90"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-5">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-5">
              個人の感想
            </h2>
            <div className="border border-border rounded-md p-2 my-6">
              <UserVoicesCarousel
                intervalMs={3000}
                pauseOnHover
                orientation="vertical"
                containerHeight="100px"
                showControls={false}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-5">
              活用例
            </h3>
            <div className="grid gap-5">
              {USAGE_EXAMPLES.map((example, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/50 dark:bg-muted/20 rounded-lg border-l-4 border-l-blue-500"
                >
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {example.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
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
