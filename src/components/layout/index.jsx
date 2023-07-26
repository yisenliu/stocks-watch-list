import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '@lib/pace';
import Container from './Container';
import Header from './Header.jsx';
import Main from './Main';
import StockContext from '@contexts/StockContext';

import useFinMindToken from '@hooks/useFinMindToken';

const stocks = {
  tw: localStorage.getItem('stocks_tw')
    ? JSON.parse(localStorage.getItem('stocks_tw'))
    : [{ id: '0050' }, { id: '0056' }, { id: '2886' }, { id: '00679B' }, { id: '00720B' }, { id: '6657' }],
  us: localStorage.getItem('stocks_us')
    ? JSON.parse(localStorage.getItem('stocks_us'))
    : [{ id: 'AAPL' }, { id: 'MSFT' }, { id: 'NFLX' }, { id: 'NVDA' }, { id: 'USO' }],
};

for (const [key, value] of Object.entries(stocks)) {
  const hasLocalStorageKey = localStorage.getItem(`stocks_${key}`);
  if (!hasLocalStorageKey) {
    localStorage.setItem(`stocks_${key}`, JSON.stringify(value));
  }
}

export default function Layout() {
  const [keyword, setKeyword] = useState('');
  const pathname = useLocation().pathname;
  const market = process.env.isGithubPages ? pathname.split('/')[2] : pathname.split('/')[1];
  const [watchList, setWatchList] = useState(stocks);
  const token = useFinMindToken();
  const context = { keyword, setKeyword, watchList, setWatchList, updateWatchList, market, token };

  function updateWatchList(market, newData) {
    // console.log('updateWatchList');
    return new Promise(resolve => {
      const newList = { [market]: newData };
      localStorage.setItem(`stocks_${market}`, JSON.stringify(newData));
      setWatchList(list => ({ ...list, ...newList }));
      setTimeout(resolve, 0);
    });
  }

  return (
    <StockContext.Provider value={context}>
      <Container>
        <Header />
        <Main>
          <Outlet />
        </Main>
      </Container>
    </StockContext.Provider>
  );
}
