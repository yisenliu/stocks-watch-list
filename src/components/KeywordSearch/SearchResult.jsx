import { useContext } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import highlightWords from 'highlight-words';
import IconButton from '@mui/material/IconButton';
import StockContext from '@contexts/StockContext';

function Stock({ keyword, stock }) {
  const { dispatch, watchList, market } = useContext(StockContext);
  const stockList = watchList[market];
  const { stock_id, stock_name, industry_category, type } = stock;
  const isExist = stockList.some(stock => stock.id === stock_id);

  function createHighlightWordsChunks(text, query) {
    const chunks = highlightWords({
      text,
      query,
      matchExactly: true,
    });
    return chunks.map(({ text, match, key }) =>
      match ? (
        <span className="text-amber-500" key={key}>
          {text}
        </span>
      ) : (
        <span key={key}>{text}</span>
      ),
    );
  }
  function addToWatchList() {
    dispatch({ type: 'add_stocks', market, stocks: [{ id: stock_id }] });
  }

  function removeFromWatchList() {
    dispatch({ type: 'remove_stocks', market, stocks: [{ id: stock_id }] });
  }

  return (
    <div className="flex items-center justify-between p-2 space-x-4">
      {/* <p className="w-16 text-lg">
        <span className="text-amber-500">{stock_id.slice(0, keyword.length)}</span>
        {stock_id.slice(keyword.length, stock_id.length)}
      </p> */}
      <p className="w-16 text-lg">{createHighlightWordsChunks(stock_id, keyword)}</p>
      <p className="flex-1">
        {createHighlightWordsChunks(stock_name, keyword)}
        {market === 'tw' && (
          <span className="block text-sm text-gray-500">
            {industry_category}-{type.toUpperCase()}
          </span>
        )}
      </p>
      {isExist && (
        <IconButton onClick={removeFromWatchList} aria-label="remove from watch list" sx={{ color: 'white' }}>
          <CheckCircleIcon fontSize="small" />
        </IconButton>
      )}
      {!isExist && (
        <IconButton onClick={addToWatchList} aria-label="add to watch list" sx={{ color: 'white' }}>
          <AddCircleOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
}
export default function SearchResult({ keyword, stocks }) {
  return (
    <div className="z-1 top-12 fixed left-0 w-full shadow-md">
      <div className="max-h-64 overflow-x-hidden overflow-y-auto text-white bg-gray-900">
        {stocks.map((stock, index) => (
          <Stock key={stock.stock_id + index} keyword={keyword} stock={stock} />
        ))}
      </div>
    </div>
  );
}
