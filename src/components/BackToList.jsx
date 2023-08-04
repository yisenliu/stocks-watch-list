import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import StockContext from '@contexts/StockContext';

export default function BackToList({ to, currentStock }) {
  // console.log('component: BackToList');
  const stock_id = currentStock?.stock_id;
  const { market, watchList, dispatch } = useContext(StockContext);
  const navigate = useNavigate();
  const stockList = watchList[market];
  const isExist = stockList.some(stock => stock.id === stock_id);
  const [toAdd, setToAdd] = useState(isExist);

  function backToList() {
    if (toAdd && !isExist) {
      dispatch({ type: 'add_stocks', market, stocks: [{ id: stock_id }] });
    }
    if (!toAdd && isExist) {
      dispatch({ type: 'remove_stocks', market, stocks: [{ id: stock_id }] });
    }

    navigate(to);
  }

  return (
    <div className="items-center grid w-full h-12 grid-cols-[60px_1fr_60px] bg-primary">
      <IconButton onClick={backToList} aria-label="back to watch list" sx={{ color: 'white' }}>
        <ArrowBackIcon />
      </IconButton>
      <h2 className="text-lg leading-tight text-white">{currentStock?.stock_name}</h2>
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
