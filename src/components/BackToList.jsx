import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import StockContext from '@contexts/StockContext';

export default function BackToList({ to, currentStock }) {
  const stock_id = currentStock?.stock_id;
  const { market, watchList, updateWatchList } = useContext(StockContext);
  const navigate = useNavigate();
  const stockList = watchList[market];
  const isExist = stockList.some(stock => stock.id === stock_id);
  const [toAdd, setToAdd] = useState(isExist);
  const addToWatchList = () => {
    updateWatchList(market, [...stockList, { id: stock_id }]);
  };
  const removeFromWatchList = () => {
    updateWatchList(
      market,
      stockList.filter(stock => stock.id !== stock_id),
    );
  };
  const backToList = () => {
    if (toAdd && !isExist) addToWatchList();
    if (!toAdd && isExist) removeFromWatchList();

    navigate(to);
  };

  return (
    <div className="z-5 items-center sticky top-0 grid w-full h-12 grid-cols-[60px_1fr_60px] bg-black">
      <IconButton onClick={backToList} aria-label="back to watch list" sx={{ color: 'white' }}>
        <ArrowBackIcon />
      </IconButton>
      <h2 className="leading-tight text-white">{currentStock?.stock_name}</h2>
      {toAdd && (
        <IconButton onClick={() => setToAdd(false)} aria-label="remove from watch list" sx={{ color: 'white' }}>
          <CheckCircleIcon fontSize="small" />
        </IconButton>
      )}
      {!toAdd && (
        <IconButton onClick={() => setToAdd(true)} aria-label="add to watch list" sx={{ color: 'white' }}>
          <AddCircleOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
}
