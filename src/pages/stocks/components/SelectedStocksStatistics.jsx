import { Stack, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useContext } from 'react';
import StockContext from '@contexts/StockContext';

export default function SelectedStocksStatistics({ selectedRowIds, clearSelectedRowIds }) {
  const { setWatchList, market } = useContext(StockContext);
  // console.log({ selectedRowIds });
  function removeStocksFromWatchList() {
    setWatchList(list => {
      const newList = {
        [market]: list[market].filter(stock => {
          return selectedRowIds.every(id => id !== stock.id);
        }),
      };
      return { ...list, ...newList };
    });
    clearSelectedRowIds();
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        height: 48,
        color: '#fff',
        position: 'fixed',
        zIndex: 1,
        left: 0,
        top: 0,
        background: '#aaa',
        width: '100%',
      }}
    >
      <IconButton onClick={clearSelectedRowIds} aria-label="return" size="large" sx={{ color: 'white' }}>
        <KeyboardBackspaceIcon fontSize="small" />
      </IconButton>
      {selectedRowIds.length} selected
      <IconButton
        onClick={removeStocksFromWatchList}
        aria-label="remove from watch list"
        size="large"
        sx={{ color: 'white' }}
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
}
