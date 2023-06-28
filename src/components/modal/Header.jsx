import { useContext } from 'react';
import { ModalContext } from './context/ModalContext';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Header({ title }) {
  const { onClose } = useContext(ModalContext);
  return (
    <div className="modal__header">
      <h3 className="modal__title">{title}</h3>
      {/* <button type="button" className="modal__close" onClick={onClose}>
        close
      </button> */}
      <IconButton aria-label="close" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
