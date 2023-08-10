import { createPortal } from 'react-dom';

export default function Portal({ children }) {
  return createPortal(
    <div data-name="stock_details_portal" className="z-2 fixed top-0 left-0 w-screen h-screen overflow-auto bg-black">
      {children}
    </div>,
    document.body,
  );
}
