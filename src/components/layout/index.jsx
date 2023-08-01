import { useReducer, useState } from 'react';
import { matchRoutes, Outlet, useLocation } from 'react-router-dom';
import '@lib/pace';
import Container from './Container';
import Header from './Header.jsx';
import Login from '@components/Login';
import Main from './Main';
import StockContext from '@contexts/StockContext';

function reducer(state, action) {
  const { market, stocks, type } = action;
  let newList = null;

  switch (type) {
    case 'add_stocks':
      newList = [...state[market], ...stocks];
      break;
    case 'remove_stocks':
      newList = state[market].filter(stock => stocks.every(s => s.id !== stock.id));
      break;
    case 'update_stocks':
      newList = stocks;
      break;
  }
  localStorage.setItem(`stocks_${market}`, JSON.stringify(newList));
  return { ...state, [market]: newList };
}

function createInitialState() {
  const watchList = {
    tw: JSON.parse(localStorage.getItem('stocks_tw')) || [],
    us: JSON.parse(localStorage.getItem('stocks_us')) || [],
  };

  for (const [key, value] of Object.entries(watchList)) {
    const hasLocalStorageKey = localStorage.getItem(`stocks_${key}`);
    if (!hasLocalStorageKey) {
      localStorage.setItem(`stocks_${key}`, JSON.stringify(value));
    }
  }

  return watchList;
}

export default function Layout() {
  const [keyword, setKeyword] = useState('');
  const [isShowInput, setIsShowInput] = useState(false);
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const currentLocation = useLocation();
  const pathname = currentLocation.pathname;
  const market = pathname.split('/')[1];
  const [watchList, dispatch] = useReducer(reducer, null, createInitialState);
  const context = {
    dispatch,
    isShowInput,
    keyword,
    logout,
    market,
    setIsShowInput,
    setKeyword,
    token,
    userId,
    watchList,
  };
  const memberOnlyRoutes = [{ path: 'tw/' }, { path: 'tw/:stock_id' }, { path: 'us/' }, { path: 'us/:stock_id' }];
  const memberRouteMatch = matchRoutes(memberOnlyRoutes, currentLocation);

  function logout() {
    setUserId(null);
    setToken(null);
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
  }

  function onLoginSuccess(token, userId) {
    setToken(token);
    setUserId(userId);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', userId);
  }

  return (
    <StockContext.Provider value={context}>
      <Container>
        {memberRouteMatch && !userId && <Login onSuccess={onLoginSuccess} />}
        {(!memberRouteMatch || userId) && (
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
