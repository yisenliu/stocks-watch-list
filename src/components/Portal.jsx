import { createPortal } from 'react-dom';

export default function Portal({ name, children }) {
  // console.log('component: Portal');
  return createPortal(
    <div data-name={name} className="z-2 fixed top-0 left-0 w-screen h-screen overflow-auto bg-black">
      {children}
    </div>,
    document.body,
  );
}
