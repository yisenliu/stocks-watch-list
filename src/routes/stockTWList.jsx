import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import StockContext from '@contexts/StockContext';
import { DataGrid } from '@mui/x-data-grid';
import fetch from '@utils/fetch';
import moment from 'moment';
import dataGridStyles from '@pages/stocks/dataGridStyles';

const columns = [
  { field: 'id', flex: 1, headerName: '代號' },
  {
    field: 'price',
    width: 120,
    headerName: '現價',
    type: 'number',
    align: 'right',
    headerAlign: 'right',
    valueGetter: params => {
      return params.row.close;
    },
  },
  {
    field: 'percent',
    width: 120,
    headerName: '漲幅 %',
    align: 'right',
    headerAlign: 'right',
    valueGetter: params => {
      return parseFloat((params.row.spread / params.row.open) * 100).toFixed(2);
    },
    valueFormatter: params => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toLocaleString()} %`;
    },
    cellClassName: params => (params.row.spread < 0 ? 'text-red-500' : 'text-green-500'),
  },
];

export default function StockTWList() {
  const { market, watchList, setWatchList, token } = useContext(StockContext);
  const stockList = watchList[market];
  let len = stockList?.length;
  const navigate = useNavigate();
  const getStockPrice = ticker => {
    return fetch({
      url: '/api/stock',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      params: {
        dataset: 'TaiwanStockPrice',
        data_id: ticker,
        start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      },
    })
      .then(res => res.data.data)
      .then(data => {
        const latest = data[data.length - 1];

        if (latest) {
          const { stock_id, spread, close, open } = latest;
          return { id: stock_id, spread, close, open };
        }
        return { id: ticker, spread: '-', close: '-', open: '-' };
      });
  };

  useEffect(() => {
    if (len > 0) {
      const rowsPromise = stockList.map(item => {
        return getStockPrice(item.id);
      });
      Promise.all(rowsPromise).then(data => {
        // console.log(data);
        const newList = { [market]: data };
        localStorage.setItem(`stocks_${market}`, JSON.stringify(data));
        setWatchList(list => ({ ...list, ...newList }));
      });
    }
  }, [len]);

  return (
    <div className="-m-4">
      {stockList !== null && (
        <DataGrid
          disableColumnMenu
          sx={dataGridStyles}
          rows={stockList}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20]}
          onRowClick={params => {
            navigate(`/tw/${params.id}`);
          }}
        />
      )}
      <Outlet />
    </div>
  );
}
