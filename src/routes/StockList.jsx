import { stockColumns, gridStyles } from '@lib/muiDataGrid';
import { getStockInfoDatasetByMarket, getStockPriceDatasetByMarket } from '@utils/getDataSetByMarket';
import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import concatParams from '@utils/concatParams';
import DraggableDataGrid from '@components/DraggableDataGrid';
import ErrorMsg from '@components/ErrorMsg';
import fetch from '@utils/fetch';
import initDB from '@lib/initDB';
import Loading from '@components/Loading';
import moment from 'moment';
import StockContext from '@contexts/StockContext';
import SelectedStocksStatistics from '@components/SelectedStocksStatistics';
import useStockInfo from '@hooks/useStockInfo';

let priceCacheMap = new Map();

export function StockList() {
  // console.log('route: StockList');
  const [apiRefCurrent, setApiRefCurrent] = useState(null);
  const { dispatch, market, token, watchList } = useContext(StockContext);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const { stock_id } = useParams();
  const stockInfoDataset = getStockInfoDatasetByMarket(market);
  const storeName = `stocks_info_${market}`;
  const { error, stage } = useStockInfo(stockInfoDataset, token, storeName);
  const stockPriceDataset = getStockPriceDatasetByMarket(market);
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const watchListByMarket = watchList[market];
  let stocksNum = watchListByMarket?.length;

  function clearSelectedRowIds() {
    setSelectedRowIds([]);
  }
  function onRowClick(params) {
    if (selectedRowIds.length === 0) {
      navigate(params.id);
    } else {
      updateSelectedRowIds(params.id);
    }
  }
  async function onSortModelChange(newSortModel) {
    await setSortModel(newSortModel);
    dispatch({ type: 'update_stocks', market, stocks: apiRefCurrent.getSortedRows() });
  }
  function updateSelectedRowIds(draggableId) {
    if (selectedRowIds.includes(draggableId)) {
      // remove from selection
      setSelectedRowIds(ids => ids.filter(id => id !== draggableId));
      apiRefCurrent.selectRow(draggableId, false);
    } else {
      // add to selection
      setSelectedRowIds([...selectedRowIds, draggableId]);
      apiRefCurrent.selectRow(draggableId, true);
    }
  }

  useEffect(() => {
    function getStockPrice(stock_id) {
      const key = `stock_price_${market}_${stock_id}`;
      if (priceCacheMap.has(key)) {
        return priceCacheMap.get(key);
      }
      const params = {
        dataset: stockPriceDataset,
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
          const { db } = await initDB(storeName);
          const stock = await db.getFromIndex(storeName, 'stock_id', stock_id);
          const name = stock?.stock_name || '-';
          const latest = data[data.length - 1];
          let result = { id: stock_id, spread: '-', close: '-', open: '-', name };

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
    if (stocksNum > 0 && stage === 'fetched') {
      const rowsPromise = watchListByMarket.map(item => {
        return getStockPrice(item.id);
      });

      Promise.all(rowsPromise).then(data => {
        dispatch({ type: 'update_stocks', market, stocks: data });
      });
    }
  }, [stocksNum, stage]);

  useEffect(() => {
    apiRefCurrent?.setRowSelectionModel(selectedRowIds);
  }, [selectedRowIds, pathname]);

  return (
    <>
      {stage === 'fetching' && <Loading />}
      {error && <ErrorMsg>{error.message}</ErrorMsg>}
      {!stock_id && stage === 'fetched' && (
        <>
          {selectedRowIds.length > 0 && (
            <SelectedStocksStatistics clearSelectedRowIds={clearSelectedRowIds} selectedRowIds={selectedRowIds} />
          )}
          {watchListByMarket.length > 0 && (
            <DraggableDataGrid
              className="-m-4"
              columns={stockColumns}
              disableColumnMenu
              disableColumnResize={true}
              dispatch={dispatch}
              hideFooter
              market={market}
              onRowClick={onRowClick}
              onSortModelChange={onSortModelChange}
              rows={watchListByMarket}
              setSelectedRowIds={setSelectedRowIds}
              selectedRowIds={selectedRowIds}
              setApiRefCurrent={setApiRefCurrent}
              sortModel={sortModel}
              sortingOrder={['asc', 'desc']}
              sx={gridStyles}
              updateSelectedRowIds={updateSelectedRowIds}
            />
          )}
          {watchListByMarket.length === 0 && (
            <p className="mx-4 my-8 text-center text-white">您尚未建立觀察名單，請按右上角「+」</p>
          )}
        </>
      )}
      <Outlet />
    </>
  );
}
