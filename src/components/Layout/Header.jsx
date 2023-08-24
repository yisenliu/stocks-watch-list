import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Navigation from '@components/Navigation';
import KeywordSearch from '@components/KeywordSearch';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import StockContext from '@contexts/StockContext';
import tw, { css } from 'twin.macro';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

const naviTrigger = css`
  ${tw`before:origin-bottom-left after:origin-top-left flex flex-col items-center justify-center h-12 cursor-pointer`}
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

function ToggleDetailedRowButton({ showDetailedRow, onClick }) {
  return (
    <IconButton onClick={onClick} aria-label="show/hide stock name" size="large" sx={{ color: 'white' }}>
      {showDetailedRow && <ViewColumnIcon fontSize="medium" />}
      {!showDetailedRow && <ViewModuleIcon fontSize="medium" />}
    </IconButton>
  );
}
export default function Header() {
  const { market, isShowKeywordSearch, setKeyword, setIsShowKeywordSearch, showDetailedRow, setShowDetailedRow } =
    useContext(StockContext);
  const pathname = useLocation().pathname;
  const inStockMarket = pathname.includes('stock_market');
  const inMarketIndex = pathname.includes('market_index');
  const [isShowNavi, setIsShowNavi] = useState(false);

  function closeMenu(e) {
    if (e.target === e.currentTarget) {
      setIsShowNavi(false);
    }
  }

  function openKeywordSearch() {
    setIsShowKeywordSearch(true);
  }

  function handleMenuBtnClick() {
    if (isShowKeywordSearch) {
      setIsShowKeywordSearch(false);
      setKeyword('');
    } else {
      setIsShowNavi(true);
    }
  }

  function toggleDetailedRow() {
    localStorage.setItem('show_detailed_row', !showDetailedRow);
    setShowDetailedRow(!showDetailedRow);
  }

  return (
    <header data-name="header" className="z-1 sticky top-0 w-full text-white bg-gray-900">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 48 }}>
        <Button
          css={naviTrigger}
          className={isShowKeywordSearch ? 'active' : ''}
          onClick={handleMenuBtnClick}
          disableRipple
        >
          <span>Open Navigation</span>
        </Button>
        {inStockMarket && !isShowKeywordSearch && (
          <>
            <h3 className="flex-1 text-left">{market === 'tw' ? '台股' : '美股'}</h3>
            <IconButton onClick={openKeywordSearch} aria-label="show input" size="large" sx={{ color: 'white' }}>
              <AddIcon fontSize="medium" />
            </IconButton>
            <ToggleDetailedRowButton showDetailedRow={showDetailedRow} onClick={toggleDetailedRow} />
          </>
        )}
        {inStockMarket && isShowKeywordSearch && <KeywordSearch />}
        {inMarketIndex && <ToggleDetailedRowButton showDetailedRow={showDetailedRow} onClick={toggleDetailedRow} />}
      </Stack>
      <Navigation isOpen={isShowNavi} closeMenu={closeMenu} />
    </header>
  );
}
