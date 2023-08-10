import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Navigation from '@components/Navigation';
import KeywordSearch from '@components/KeywordSearch';
import Stack from '@mui/material/Stack';
import StockContext from '@contexts/StockContext';
import tw, { css } from 'twin.macro';

const naviTrigger = css`
  ${tw`before:origin-bottom-left after:origin-top-left flex flex-col items-center justify-center w-10 h-12 cursor-pointer`}
  &::before,
  &::after {
    content: '';
    ${tw`block w-6 h-[2px] bg-white transition-all duration-300`}
  }
  span {
    ${tw`text-0 block w-6 h-[2px] bg-white my-1 origin-left transition-all duration-300`}
  }
  &.active {
    &::before {
      ${tw`-rotate-45 scale-x-50 translate-y-[6px]`}
    }
    &::after {
      ${tw`rotate-45 scale-x-50 -translate-y-[6px]`}
    }
    span {
      ${tw`scale-x-75`}
    }
  }
`;

export default function Header() {
  const { isShowInput, setIsShowInput } = useContext(StockContext);
  const pathname = useLocation().pathname;
  const inStockMarket = pathname.includes('stock_market');
  const [isShowNavi, setIsShowNavi] = useState(false);

  function closeMenu(e) {
    if (e.target === e.currentTarget) {
      setIsShowNavi(false);
    }
  }

  function onKeywordSearchOpen() {
    setIsShowInput(true);
  }

  function handleMenuBtnClick() {
    if (isShowInput) {
      setIsShowInput(false);
    } else {
      setIsShowNavi(true);
    }
  }

  return (
    <header data-name="header" className="z-1 sticky top-0 w-full text-white bg-gray-900">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 48 }}>
        <Button css={naviTrigger} className={isShowInput ? 'active' : ''} onClick={handleMenuBtnClick} disableRipple>
          <span>Open Navigation</span>
        </Button>
        {inStockMarket && <KeywordSearch onOpen={onKeywordSearchOpen} />}
      </Stack>
      <Navigation isOpen={isShowNavi} closeMenu={closeMenu} />
    </header>
  );
}
