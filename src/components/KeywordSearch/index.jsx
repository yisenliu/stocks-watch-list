import { useCallback, useContext, useRef } from 'react';
import { debounce } from 'lodash';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorMsg from '@components/ErrorMsg';
import IconButton from '@mui/material/IconButton';
import Loading from '@components/Loading';
import SearchResult from './SearchResult';
import StockContext from '@contexts/StockContext';
import tw from 'twin.macro';

const Input = tw.input`w-full mr-2 border-none bg-transparent focus:ring-0`;

export default function KeywordSearch() {
  const { keyword, setKeyword, stocksInfo } = useContext(StockContext);
  const { data, error, stage } = stocksInfo;
  const matchedStocks =
    keyword && stage === 'fetched'
      ? data.filter(stock => stock.stock_id.startsWith(keyword) || stock.stock_name.toUpperCase().includes(keyword))
      : null;
  const keywordRef = useRef();
  const onChange = useCallback(
    debounce(e => {
      const newValue = e.target.value;
      keywordRef.current.value = newValue;
      setKeyword(newValue.toUpperCase());
    }, 500),
    [keyword],
  );

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
