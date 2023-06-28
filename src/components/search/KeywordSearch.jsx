import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash.debounce';
import { useCallback, useContext, useRef } from 'react';
import StockContext from '@contexts/StockContext';
import tw from 'twin.macro';
import useStockInfo from '@pages/stocks/hooks/useStockInfo';
import SearchResult from './SearchResult';
import Loading from '@components/Loading';

const Input = tw.input`w-full mr-2 border-none bg-transparent focus:ring-0`;

function getDataSetByMarket(market) {
  switch (market) {
    case 'tw':
      return 'TaiwanStockInfo';
    case 'us':
      return 'USStockInfo';
  }
}

export default function KeywordSearch({ isShowInput, onOpen }) {
  const { keyword, setKeyword, market, token } = useContext(StockContext);
  const dataset = getDataSetByMarket(market);
  const allStocks = useStockInfo(token, dataset);
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
    setKeyword('');
  };
  const handleShowInput = () => {
    onOpen();
    setKeyword('');
  };

  return (
    <>
      {allStocks.loading && <Loading />}
      {!allStocks.loading && (
        <>
          {!isShowInput && (
            <IconButton onClick={handleShowInput} aria-label="show input" size="large" sx={{ color: 'white' }}>
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
    </>
  );
}
