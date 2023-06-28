import { useContext, useEffect, useState } from 'react';
import { ModalContext } from './context/ModalContext';

export default function Content({ children }) {
  const { open } = useContext(ModalContext);
  const base =
    'modal__content w-full transition-all duration-300 overflow-hidden relative z-2 rounded-lg top-0 mb-12 mx-auto sm:max-w-[85vw] md:max-w-[95vw] lg:max-w-[90vw] opacity-0';
  const [css, setCss] = useState(base);
  let cssInt = null;

  useEffect(() => {
    if (open) {
      cssInt = setTimeout(() => {
        setCss(base + ' opacity-100 mt-12 delay-200');
      }, 0);
    }
    return () => {
      clearTimeout(cssInt);
      setCss(base);
    };
  }, [open]);

  return <div className={css}>{children}</div>;
}
