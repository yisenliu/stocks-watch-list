import { useContext, useEffect, useRef, useState } from 'react';
import { ModalContext } from './context/ModalContext';

export default function Overlay() {
  const ref = useRef();
  const { setActive, open } = useContext(ModalContext);
  const base =
    'w-full h-full overflow-hidden bg-black/40 fixed z-1 top-0 right-0 bottom-0 left-0 m-auto transition-opacity duration-300 opacity-0 ';
  const [css, setCss] = useState(base);

  useEffect(() => {
    const css = open ? 'opacity-100' : 'delay-300';
    setTimeout(() => {
      setCss(base + css);
    }, 0);
    const modalOverlay = ref.current;
    modalOverlay.addEventListener('transitionend', () => {
      if (!open) {
        setActive(false);
      }
    });
  }, [open]);

  return <div className={css} id="ModalOverlay" ref={ref}></div>;
}
