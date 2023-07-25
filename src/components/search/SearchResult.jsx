import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useContext } from 'react';
import StockContext from '@contexts/StockContext';

function Stock({ keyword, stock }) {
  const { watchList, updateWatchList, market } = useContext(StockContext);
  const stockList = watchList[market];
  const { stock_id, stock_name, industry_category, type } = stock;
  const addToWatchList = function () {
    updateWatchList(market, [...stockList, { id: stock_id }]);
  };
  const removeFromWatchList = function () {
    updateWatchList(
      market,
      stockList.filter(stock => stock.id !== stock_id),
    );
  };
  const isExist = stockList.some(stock => stock.id === stock_id);

  return (
    <div className="flex items-center justify-between p-2 space-x-4">
      <p className="w-16 text-lg">
        <span className="text-amber-500">{stock_id.slice(0, keyword.length)}</span>
        {stock_id.slice(keyword.length, stock_id.length)}
      </p>
      <p className="flex-1">
        {stock_name}
        {market === 'tw' && (
          <span className="block text-sm text-gray-500">
            {industry_category}-{type.toUpperCase()}
          </span>
        )}
      </p>
      {isExist && (
        <IconButton
          onClick={removeFromWatchList}
          aria-label="remove from watch list"
          size="large"
          sx={{ color: 'white' }}
        >
          <CheckCircleIcon fontSize="small" />
        </IconButton>
      )}
      {!isExist && (
        <IconButton onClick={addToWatchList} aria-label="add to watch list" size="large" sx={{ color: 'white' }}>
          <AddCircleOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
}
export default function SearchResult({ keyword, stocks }) {
  return (
    <div className="z-1 top-12 max-h-64 fixed w-full overflow-x-hidden overflow-y-auto text-white bg-gray-800">
      {stocks.map((stock, index) => {
        {
          /* const { industry_category, stock_id, stock_name, type } = stock; */
        }
        return <Stock key={stock.stock_id + index} keyword={keyword} stock={stock} />;
      })}
    </div>
  );
}
