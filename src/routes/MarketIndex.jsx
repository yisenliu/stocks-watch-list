import { DataGridPro } from '@mui/x-data-grid-pro';
import { gridStyles, stockColumns } from '@lib/muiDataGrid';
import { getStockInfoDatasetByMarket, getStockPriceDatasetByMarket } from '@utils/getDataSetByMarket';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import concatParams from '@utils/concatParams';
import ErrorMsg from '@components/ErrorMsg';
import fetch from '@utils/fetch';
import initDB from '@lib/initDB';
import Loading from '@components/Loading';
import moment from 'moment';
import StockContext from '@contexts/StockContext';
import useStockInfo from '@hooks/useStockInfo';

let priceCacheMap = new Map();
const market_indexes = [
  { market: 'tw', stock_ids: ['TAIEX'] },
  { market: 'us', stock_ids: ['^DJI', '^GSPC', '^IXIC', '^SOX'] },
];
const stockInfoDataset = market_indexes.reduce((acc, current) => {
  const { market } = current;

  return { ...acc, [market]: getStockInfoDatasetByMarket(market) };
}, {});
const stockPriceDataset = market_indexes.reduce((acc, current) => {
  const { market } = current;

  return { ...acc, [market]: getStockPriceDatasetByMarket(market) };
}, {});

export function MarketIndex() {
  // console.log('route: MarketIndex');
  const [stockList, setStockList] = useState(null);
  const { token } = useContext(StockContext);
  const navigate = useNavigate();
  const stockInfoTW = useStockInfo(stockInfoDataset.tw, token, 'stocks_info_tw');
  const stockInfoUS = useStockInfo(stockInfoDataset.us, token, 'stocks_info_us');
  let stockPricePromises = [];
  let error = null;
  let stage = 'idle';
  let stocksNum = stockList !== null ? stockList.length : 0;

  function onRowClick(params) {
    navigate(`/stock_market/${params.row.market}/${params.id}`);
  }

  if (stockInfoTW.error || stockInfoUS.error) {
    error = stockInfoTW.error || stockInfoUS.error;
  }
  if (!error && (stockInfoTW.stage === 'fetching' || stockInfoUS.stage === 'fetching')) {
    stage = 'fetching';
  }
  if (stockInfoTW.stage === 'fetched' && stockInfoUS.stage === 'fetched') {
    error = null;
    stage = 'fetched';
  }

  useEffect(() => {
    function getStockPrice(market, stock_id) {
      const key = `stock_price_${market}_${stock_id}`;
      if (priceCacheMap.has(key)) {
        return priceCacheMap.get(key);
      }
      const params = {
        dataset: stockPriceDataset[market],
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
        .then(async data => {
          const storeName = `stocks_info_${market}`;
          const { db } = await initDB(storeName);
          const stock = await db.getFromIndex(storeName, 'stock_id', stock_id);
          const name = stock?.stock_name || '-';
          const latest = data[data.length - 1];
          let result = { market, id: stock_id, spread: '-', close: '-', open: '-', name };

          if (latest) {
            if (market === 'tw') {
              const { spread, close, open } = latest;
              result = { ...result, spread, close, open };
            }
            if (market === 'us') {
              const { Close, Open } = latest;
              result = { ...result, spread: Close - Open, close: Close, open: Open };
            }
          }
          priceCacheMap.set(key, result);

          return result;
        });
    }

    if (stage === 'fetched') {
      market_indexes.forEach(({ market, stock_ids }) => {
        stock_ids.forEach(stock_id => stockPricePromises.push(getStockPrice(market, stock_id)));
      });
      Promise.all(stockPricePromises).then(data => {
        setStockList(data);
      });
    }
  }, [stage]);

  return (
    <>
      {stage === 'fetching' && <Loading />}
      {error && <ErrorMsg>{error.message}</ErrorMsg>}
      {stocksNum > 0 && (
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
    </>
  );
}
