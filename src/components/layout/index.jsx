import { useState } from 'react';
import { matchRoutes, Outlet, useLocation } from 'react-router-dom';
import '@lib/pace';
import Container from './Container';
import Header from './Header.jsx';
import Login from '@components/Login';
import Main from './Main';
import StockContext from '@contexts/StockContext';

const stocks = {
  tw: localStorage.getItem('stocks_tw')
    ? JSON.parse(localStorage.getItem('stocks_tw'))
    : [{ id: '0050' }, { id: '0056' }, { id: '2886' }],
  us: localStorage.getItem('stocks_us')
    ? JSON.parse(localStorage.getItem('stocks_us'))
    : [{ id: 'AAPL' }, { id: 'MSFT' }, { id: 'NFLX' }],
};

for (const [key, value] of Object.entries(stocks)) {
  const hasLocalStorageKey = localStorage.getItem(`stocks_${key}`);
  if (!hasLocalStorageKey) {
    localStorage.setItem(`stocks_${key}`, JSON.stringify(value));
  }
}

export default function Layout() {
  const [keyword, setKeyword] = useState('');
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const currentLocation = useLocation();
  const pathname = currentLocation.pathname;
  const market = process.env.isGithubPages ? pathname.split('/')[2] : pathname.split('/')[1];
  const [watchList, setWatchList] = useState(stocks);
  const context = { keyword, setKeyword, watchList, setWatchList, updateWatchList, market, token, userId, logout };
  const memberOnlyRoutes = [{ path: 'tw/' }, { path: 'tw/:stock_id' }, { path: 'us/' }, { path: 'us/:stock_id' }];
  const isMatchMemberRoutes = Boolean(matchRoutes(memberOnlyRoutes, currentLocation));

  function logout() {
    setUserId(null);
    setToken(null);
  }
  function updateWatchList(market, newData) {
    // console.log('updateWatchList');
    return new Promise(resolve => {
      const newList = { [market]: newData };
      localStorage.setItem(`stocks_${market}`, JSON.stringify(newData));
      setWatchList(list => ({ ...list, ...newList }));
      setTimeout(resolve, 0);
    });
  }

  function onLoginSuccess(token, userId) {
    setToken(token);
    setUserId(userId);
  }

  return (
    <StockContext.Provider value={context}>
      <Container>
        {isMatchMemberRoutes && !userId && <Login onSuccess={onLoginSuccess} />}
        {(!isMatchMemberRoutes || userId) && (
          <>
            <Header />
            <Main>
              <Outlet />
            </Main>
          </>
        )}
      </Container>
    </StockContext.Provider>
  );
}
