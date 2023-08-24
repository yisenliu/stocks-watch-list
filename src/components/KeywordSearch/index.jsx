import { useContext, useRef } from 'react';
import { getStockInfoDatasetByMarket } from '@utils/getDataSetByMarket';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorMsg from '@components/ErrorMsg';
import FlexSearch from 'flexsearch';
import IconButton from '@mui/material/IconButton';
import Loading from '@components/Loading';
import SearchResult from './SearchResult';
import StockContext from '@contexts/StockContext';
import tw from 'twin.macro';
import useStockInfo from '@hooks/useStockInfo';

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
  const { keyword, market, setKeyword, token } = useContext(StockContext);
  const stockInfoDataset = getStockInfoDatasetByMarket(market);
  const { data, error, stage } = useStockInfo(stockInfoDataset, token, `stocks_info_${market}`);
  const keywordRef = useRef();
  const onChange = debounce(e => setKeyword(e.target.value.toUpperCase()), 300);
  // 建立股票索引
  const indexedDB = new FlexSearch({ tokenize: 'full' });
  data?.forEach(({ stock_id, stock_name }, index) => indexedDB.add(index, stock_id + ',' + stock_name));
  // 以陣列儲存搜尋結果的資料索引值
  const matchedIndexs = indexedDB.search(keyword);
  const matchedStocks = matchedIndexs.map(index => data[index]);

  function clearInput() {
    keywordRef.current.value = '';
    keywordRef.current.focus();
    setKeyword('');
  }

  return (
    <>
      {stage === 'fetching' && <Loading />}
      {error && <ErrorMsg>{error.message}</ErrorMsg>}
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
    </>
  );
}
