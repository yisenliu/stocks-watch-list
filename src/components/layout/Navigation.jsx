import { useState, useEffect, useRef } from 'react';
import NavItem from './NavItem';

const navContainerStyles = 'z-2 top-0 fixed bg-black/75 ';
const navStyles = {
  open: 'translate-x-0',
  close: '-translate-x-full',
};
const navItems = [
  { to: '/', text: 'Home' },
  { to: '/tw', text: '台股' },
  { to: '/us', text: '美股' },
];

export default function Navigation({ isOpen, onClose }) {
  const navRef = useRef();
  const statusStyle = isOpen ? navStyles.open : navStyles.close;
  const [animationEnd, SetAnimationEnd] = useState(false);

  useEffect(() => {
    const navigation = navRef.current;
    const closeNavi = () => SetAnimationEnd(true);
    if (animationEnd) {
      navigation.addEventListener('transitionend', closeNavi);
    }
    return () => navigation.removeEventListener('transitionend', closeNavi);
  }, [animationEnd]);

  return (
    <>
      {!animationEnd && (
        <div className={navContainerStyles + (isOpen ? 'w-full' : 'w-0')} onClick={onClose}>
          <nav
            ref={navRef}
            className={
              'flex flex-col transition-transform w-64 h-screen p-4 space-y-4 text-white bg-gray-900 ' + statusStyle
            }
          >
            {navItems.map(link => (
              <NavItem {...link} key={link.text} onClick={onClose} />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
