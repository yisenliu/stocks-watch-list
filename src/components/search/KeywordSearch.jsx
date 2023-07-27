import { useCallback, useContext, useRef } from 'react';
import { debounce } from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { getStockInfoDataSetByMarket } from '@utils/getDataSetByMarket';
import Loading from '@components/Loading';
import SearchResult from './SearchResult';
import StockContext from '@contexts/StockContext';
import tw from 'twin.macro';
import useStockInfo from '@hooks/useStockInfo';

const Input = tw.input`w-full mr-2 border-none bg-transparent focus:ring-0`;

export default function KeywordSearch({ isShowInput, onOpen }) {
  const { keyword, setKeyword, market, token } = useContext(StockContext);
  const dataset = getStockInfoDataSetByMarket(market);
  const allStocks = useStockInfo(dataset, token);
  const matchedStocks =
    keyword && allStocks.data ? allStocks.data.filter(stock => stock.stock_id.startsWith(keyword)) : null;
  const keywordRef = useRef();
  const onChange = useCallback(
    debounce(e => {
      const newValue = e.target.value;
      keywordRef.current.value = newValue;
      setKeyword(newValue.toUpperCase());
    }, 500),
    [keyword],
  );
  const onKeyDown = e => {
    if (e.key === 'Enter' && keywordRef.current.value !== '') {
      setKeyword(e.target.value);
      keywordRef.current.value = '';
    }
  };
  const clearInput = () => {
    keywordRef.current.value = '';
    keywordRef.current.focus();
    setKeyword('');
  };
  const showInput = () => {
    onOpen();
    setKeyword('');
  };
  const state = {
    loading: allStocks.loading,
    get ready() {
      return !this.loading && !this.error;
    },
    get error() {
      return allStocks.error;
    },
  };

  return (
    <>
      {state.loading && <Loading />}
      {state.ready && (
        <>
          {!isShowInput && (
            <IconButton onClick={showInput} aria-label="show input" size="large" sx={{ color: 'white' }}>
              <AddIcon fontSize="medium" />
            </IconButton>
          )}
          {isShowInput && (
            <>
              <Input
                type="text"
                autoFocus
                placeholder="鍵入，然後按ENTER"
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={keywordRef}
              />
              {keyword !== '' && (
                <IconButton onClick={clearInput} aria-label="clear input" size="large" sx={{ color: 'white' }}>
                  <ClearIcon fontSize="inherit" />
                </IconButton>
              )}
              {matchedStocks !== null && <SearchResult stocks={matchedStocks} keyword={keyword} />}
            </>
          )}
        </>
      )}
      {state.error && <p>{state.error.message}</p>}
    </>
  );
}
