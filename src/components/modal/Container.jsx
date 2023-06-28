import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from './context/ModalContext';

export default function Container({ children, id }) {
  const { active } = useContext(ModalContext);

  return createPortal(
    <div className={active ? 'modal active' : 'modal'} id={id}>
      {children}
    </div>,
    document.body,
  );
}
