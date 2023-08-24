import { useEffect, useReducer, useState } from 'react';
import { matchRoutes, useLocation, useParams } from 'react-router-dom';
import Layout from '@components/Layout';
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
    tw: JSON.parse(localStorage.getItem('stocks_tw')) || [{ id: 'TAIEX' }],
    us: JSON.parse(localStorage.getItem('stocks_us')) || [
      { id: '^DJI' },
      { id: '^GSPC' },
      { id: '^IXIC' },
      { id: '^SOX' },
    ],
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
  // console.log('route: Dashboard');
  const [keyword, setKeyword] = useState('');
  const [isShowKeywordSearch, setIsShowKeywordSearch] = useState(false);
  const [showDetailedRow, setShowDetailedRow] = useState(localStorage.getItem('show_detailed_row') === 'true');
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [userId, setUserId] = useState(sessionStorage.getItem('user_id') || null);
  const [watchList, dispatch] = useReducer(reducer, null, createInitialState);
  const currentLocation = useLocation();
  const pathname = currentLocation.pathname;
  const { market } = useParams();
  const memberOnlyRoutes = [{ path: 'stock_market/:market' }, { path: 'stock_market/:market/:stock_id' }];
  const memberRouteMatch = matchRoutes(memberOnlyRoutes, currentLocation);
  const context = {
    dispatch,
    isShowKeywordSearch,
    setIsShowKeywordSearch,
    keyword,
    setKeyword,
    logout,
    market,
    showDetailedRow,
    setShowDetailedRow,
    token,
    userId,
    watchList,
  };

  function logout() {
    setUserId(null);
    setToken(null);
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('token');
  }

  function onLoginSuccess(userId, token) {
    setUserId(userId);
    sessionStorage.setItem('user_id', userId);
    if (token) {
      setToken(token);
      sessionStorage.setItem('token', token);
    }
  }

  function closeKeywordSearch() {
    setKeyword('');
    setIsShowKeywordSearch(false);
  }

  useEffect(() => {
    closeKeywordSearch();
  }, [pathname]);

  useEffect(() => {}, []);

  return (
    <StockContext.Provider value={context}>
      {memberRouteMatch && !userId && <Login onSuccess={onLoginSuccess} />}
      {(!memberRouteMatch || userId) && <Layout />}
    </StockContext.Provider>
  );
}
