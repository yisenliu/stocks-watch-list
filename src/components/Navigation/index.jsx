import { useContext, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import StockContext from '@contexts/StockContext';

const navContainerStyles = 'z-2 top-0 fixed bg-black/75 ';
const navStyles = {
  open: 'translate-x-0',
  close: '-translate-x-full',
};

export default function Navigation({ isOpen, closeMenu }) {
  const { logout, userId, watchList } = useContext(StockContext);
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
            className={'flex flex-col transition-transform w-64 h-screen p-4  text-white bg-gray-900 ' + statusStyle}
          >
            <NavItem to="/" text="Home" onClick={closeMenu} />
            <NavGroup name="股票觀察表">
              <NavItem to="stock_market/tw" text="台股" count={watchList.tw.length} onClick={closeMenu} />
              <NavItem to="stock_market/us" text="美股" count={watchList.us.length} onClick={closeMenu} />
            </NavGroup>
            <NavGroup name="其他資料集">
              <NavItem to="us_treasury_bound" text="美國政府公債殖利率" onClick={closeMenu} />
              <NavItem to="gold_price" text="黃金價格" onClick={closeMenu} />
            </NavGroup>
            {sessionStorage.getItem('user_id') && (
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
