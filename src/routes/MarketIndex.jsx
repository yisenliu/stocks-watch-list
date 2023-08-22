import { DataGridPro } from '@mui/x-data-grid-pro';
import { gridStyles, stockColumns } from '@lib/muiDataGrid';
import { getStockPriceDataSetByMarket } from '@utils/getDataSetByMarket';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import concatParams from '@utils/concatParams';
import fetch from '@utils/fetch';
import moment from 'moment';
import StockContext from '@contexts/StockContext';

let priceCacheMap = new Map();
const market_indexes = [
  { market: 'tw', stock_ids: ['TAIEX'] },
  { market: 'us', stock_ids: ['^DJI', '^GSPC', '^IXIC', '^SOX'] },
];
const initList = market_indexes.reduce((acc, { stock_ids }) => {
  let list = stock_ids.map(stock_id => ({ id: stock_id, spread: '-', close: '-', open: '-' }));

  acc.push(...list);

  return acc;
}, []);

export function MarketIndex() {
  // console.log('route: MarketIndex');
  const [stockList, setStockList] = useState(initList);
  const { stock_id } = useParams();
  const { token } = useContext(StockContext);
  let stockPricePromises = [];
  const navigate = useNavigate();

  function getStockPrice(market, stock_id) {
    const key = `stock_price_${market}_${stock_id}`;
    if (priceCacheMap.has(key)) {
      return priceCacheMap.get(key);
    }
    const params = {
      dataset: getStockPriceDataSetByMarket(market),
      data_id: stock_id,
      start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    };
    const paramsStr = concatParams(token ? { ...params, token } : params);

    return fetch({
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
      .then(res => res.data.data)
      .then(data => {
        let result = { market, id: stock_id, spread: '-', close: '-', open: '-' };
        const latest = data[data.length - 1];

        if (latest) {
          if (market === 'tw') {
            const { stock_id, spread, close, open } = latest;
            result = { market, id: stock_id, spread, close, open };
          }
          if (market === 'us') {
            const { stock_id, Close, Open } = latest;
            result = { market, id: stock_id, spread: Close - Open, close: Close, open: Open };
          }
        }
        priceCacheMap.set(key, result);

        return result;
      });
  }

  function onRowClick(params) {
    navigate(`/stock_market/${params.row.market}/${params.id}`);
  }

  market_indexes.forEach(({ market, stock_ids }) => {
    stock_ids.forEach(stock_id => stockPricePromises.push(getStockPrice(market, stock_id)));
  });

  useEffect(() => {
    Promise.all(stockPricePromises).then(data => {
      setStockList(data);
    });
  }, []);

  return (
    <>
      {!stock_id && (
        <DataGridPro
          className="-m-4"
          columns={stockColumns}
          disableColumnMenu
          disableColumnResize={true}
          hideFooter
          onRowClick={onRowClick}
          rows={stockList}
          sx={gridStyles}
        />
      )}
      <Outlet />
    </>
  );
}
