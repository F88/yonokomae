import React from 'react';
interface UserManualProps {
  isOpen: boolean;
  onClose: () => void;
  modalHeight?: string;
}
export declare const UserManual: React.FC<UserManualProps>;
export default UserManual;
