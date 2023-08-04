import { useContext, useEffect, useRef, useState } from 'react';
import NavItem from './NavItem';
import StockContext from '@contexts/StockContext';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const navContainerStyles = 'z-2 top-0 fixed bg-black/75 ';
const navStyles = {
  open: 'translate-x-0',
  close: '-translate-x-full',
};
const navItems = [
  { to: '/', text: 'Home' },
  { to: 'tw', text: '台股' },
  { to: 'us', text: '美股' },
];

export default function Navigation({ isOpen, closeMenu }) {
  const { logout, userId } = useContext(StockContext);
  const navRef = useRef();
  const statusStyle = isOpen ? navStyles.open : navStyles.close;
  const [animationEnd, SetAnimationEnd] = useState(false);

  useEffect(() => {
    const navigation = navRef.current;
    function closeNavi() {
      SetAnimationEnd(true);
    }
    if (animationEnd) {
      navigation.addEventListener('transitionend', closeNavi);
    }
    return () => navigation.removeEventListener('transitionend', closeNavi);
  }, [animationEnd]);

  return (
    <>
      {!animationEnd && (
        <div data-name="navigation" className={navContainerStyles + (isOpen ? 'w-full' : 'w-0')} onClick={closeMenu}>
          <div
            ref={navRef}
            className={
              'flex flex-col transition-transform w-64 h-screen p-4 space-y-4 text-white bg-gray-900 ' + statusStyle
            }
          >
            {navItems.map(link => (
              <NavItem {...link} key={link.text} onClick={closeMenu} />
            ))}
            {sessionStorage.getItem('userId') && (
              <Button
                variant="contained"
                endIcon={<LogoutIcon />}
                sx={{ textTransform: 'none' }}
                onClick={e => {
                  logout();
                  closeMenu(e);
                }}
              >
                {`登出 ${userId}`}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
