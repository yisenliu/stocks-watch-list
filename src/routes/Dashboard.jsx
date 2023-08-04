import { useReducer, useState } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import Layout from '@components/layout';
import Login from '@components/Login';
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

export default function Dashboard() {
  console.log('route: Dashboard');
  const [keyword, setKeyword] = useState('');
  const [isShowInput, setIsShowInput] = useState(false);
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [watchList, dispatch] = useReducer(reducer, null, createInitialState);
  const currentLocation = useLocation();
  const pathname = currentLocation.pathname;
  const market = pathname.split('/')[1];
  const memberOnlyRoutes = [{ path: 'tw/' }, { path: 'tw/:stock_id' }, { path: 'us/' }, { path: 'us/:stock_id' }];
  const memberRouteMatch = matchRoutes(memberOnlyRoutes, currentLocation);
  const [stocksInfo, setStocksInfo] = useState({ data: null, error: null, loading: false });
  const context = {
    dispatch,
    isShowInput,
    setIsShowInput,
    keyword,
    setKeyword,
    logout,
    market,
    stocksInfo,
    setStocksInfo,
    token,
    userId,
    watchList,
  };

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
      {memberRouteMatch && !userId && <Login onSuccess={onLoginSuccess} />}
      {(!memberRouteMatch || userId) && <Layout />}
    </StockContext.Provider>
  );
}
