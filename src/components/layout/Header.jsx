import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import tw, { css } from 'twin.macro';
import Navigation from './Navigation';
import { Stack, Button } from '@mui/material';
import KeywordSearch from '@components/search/KeywordSearch';

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
  const pathname = useLocation().pathname;
  console.log({ pathname });
  const isRoot = process.env.isGithubPages ? pathname === '/stocks-watch-list/' : pathname === '/';
  const [isShowNavi, setIsShowNavi] = useState(false);
  const [isShowInput, setIsShowInput] = useState(false);
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
    <header className="z-1 sticky top-0 w-full text-white bg-gray-900">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ height: 48 }}>
        <Button css={naviTrigger} className={isShowInput ? 'active' : ''} onClick={handleMenuBtnClick} disableRipple>
          <span>Open Navigation</span>
        </Button>
        {!isRoot && <KeywordSearch onOpen={onKeywordSearchOpen} isShowInput={isShowInput} />}
      </Stack>
      <Navigation isOpen={isShowNavi} onClose={closeMenu} />
    </header>
  );
}
