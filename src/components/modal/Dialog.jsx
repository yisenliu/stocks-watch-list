import { useContext } from 'react';
import { ModalContext } from './context/ModalContext';

export default function Dialog({ children }) {
  const { onClose } = useContext(ModalContext);
  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal__dialog" onClick={handleClose}>
      {children}
    </div>
  );
}
