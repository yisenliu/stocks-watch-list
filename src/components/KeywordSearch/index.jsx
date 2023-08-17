import { useContext, useRef } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorMsg from '@components/ErrorMsg';
import FlexSearch from 'flexsearch';
import IconButton from '@mui/material/IconButton';
import Loading from '@components/Loading';
import SearchResult from './SearchResult';
import StockContext from '@contexts/StockContext';
import tw from 'twin.macro';

const Input = tw.input`w-full mr-2 border-none bg-transparent focus:ring-0`;

function debounce(fun, delay) {
  let timerId = null;

  return function (...args) {
    let self = this;

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fun.apply(self, args);
    }, delay);
  };
}

export default function KeywordSearch() {
  const { keyword, setKeyword, stocksInfo } = useContext(StockContext);
  const { data, error, stage } = stocksInfo;
  const keywordRef = useRef();
  const onChange = debounce(e => setKeyword(e.target.value.toUpperCase()), 500);
  // 建立股票索引
  const indexDB = new FlexSearch({ tokenize: 'full' });
  data?.forEach(({ stock_id, stock_name }, index) => indexDB.add(index, stock_id + ',' + stock_name));
  // 以陣列儲存搜尋結果的資料索引值
  const matchedIndexs = indexDB.search(keyword);
  const matchedStocks = matchedIndexs.map(index => data[index]);

  function clearInput() {
    keywordRef.current.value = '';
    keywordRef.current.focus();
    setKeyword('');
  }

  return (
    <>
      {stage === 'fetching' && <Loading />}
      {stage === 'fetched' && (
        <div data-name="keyword_search" className="flex items-center flex-1">
          <Input type="text" autoFocus placeholder="輸入代碼或關鍵字" onChange={onChange} ref={keywordRef} />
          {keyword !== '' && (
            <IconButton onClick={clearInput} aria-label="clear input" size="large" sx={{ color: 'white' }}>
              <ClearIcon fontSize="inherit" />
            </IconButton>
          )}
          {matchedStocks !== null && <SearchResult stocks={matchedStocks} keyword={keyword} />}
        </div>
      )}
      {error && <ErrorMsg>{error.message}</ErrorMsg>}
    </>
  );
}
