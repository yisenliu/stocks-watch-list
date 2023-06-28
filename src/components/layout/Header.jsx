import './header.sass';
import Navigation from './Navigation';
import { Stack, Button } from '@mui/material';
import KeywordSearch from '@components/search/KeywordSearch';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const isRoot = useLocation().pathname === '/';
  const [isShowNavi, setIsShowNavi] = useState(false);
  const [isShowInput, setIsShowInput] = useState(false);
  const naviTriggerCSS = isShowInput ? `naviTrigger active` : 'naviTrigger';
  const closeMenu = e => {
    if (e.target === e.currentTarget) {
      setIsShowNavi(false);
    }
  };
  const onKeywordSearchOpen = () => setIsShowInput(true);
  const handleMenuBtnClick = () => {
    if (isShowInput) {
      setIsShowInput(false);
    } else {
      setIsShowNavi(true);
    }
  };

  return (
    <header className="header">
      <Stack direction="row" justifyContent="space-between" sx={{ height: 48 }}>
        <Button className={naviTriggerCSS} onClick={handleMenuBtnClick} disableRipple>
          <span>Open Navigation</span>
        </Button>
        {!isRoot && <KeywordSearch onOpen={onKeywordSearchOpen} isShowInput={isShowInput} />}
      </Stack>
      <Navigation open={isShowNavi} onClose={closeMenu} />
    </header>
  );
}
