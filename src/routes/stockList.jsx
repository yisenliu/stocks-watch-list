import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import concatParams from '@utils/concatParams';
import DraggableDataGrid from '@components/DraggableDataGrid';
import { columns, gridStyles } from '@components/muiDataGrid';
import { getStockPriceDataSetByMarket } from '@utils/getDataSetByMarket';
import fetch from '@utils/fetch';
import moment from 'moment';
import StockContext from '@contexts/StockContext';
import SelectedStocksStatistics from '@components/SelectedStocksStatistics';

export default function StockList() {
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const { dispatch, market, setIsShowInput, watchList, token } = useContext(StockContext);
  const [apiRefCurrent, setApiRefCurrent] = useState(null);
  const dataset = getStockPriceDataSetByMarket(market);
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const stockList = watchList[market];
  let stocksNum = stockList?.length;
  function clearSelectedRowIds() {
    setSelectedRowIds([]);
  }
  function getStockPrice(ticker) {
    const params = {
      dataset,
      data_id: ticker,
      start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    };
    const paramsStr = concatParams(params);

    return fetch({
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      // params
    })
      .then(res => res.data.data)
      .then(data => {
        const latest = data[data.length - 1];

        if (latest) {
          if (market === 'tw') {
            const { stock_id, spread, close, open } = latest;
            return { id: stock_id, spread, close, open };
          }
          if (market === 'us') {
            const { stock_id, Close, Open } = latest;
            return { id: stock_id, spread: Close - Open, close: Close, open: Open };
          }
        }
        return { id: ticker, spread: '-', close: '-', open: '-' };
      });
  }
  function onRowClick(params) {
    if (selectedRowIds.length === 0) {
      navigate(params.id);
      setIsShowInput(false);
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
    if (stocksNum > 0) {
      const rowsPromise = stockList.map(item => {
        return getStockPrice(item.id);
      });
      Promise.all(rowsPromise).then(data => {
        dispatch({ type: 'update_stocks', market, stocks: data });
      });
    }
  }, [stocksNum]);

  useEffect(() => {
    apiRefCurrent?.setRowSelectionModel(selectedRowIds);
  }, [selectedRowIds, pathname]);

  return (
    <>
      {selectedRowIds.length > 0 && (
        <SelectedStocksStatistics clearSelectedRowIds={clearSelectedRowIds} selectedRowIds={selectedRowIds} />
      )}
      {stockList.length > 0 && (
        <DraggableDataGrid
          className="-m-4"
          columns={columns}
          disableColumnMenu
          disableColumnResize={true}
          dispatch={dispatch}
          hideFooter
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          market={market}
          onRowClick={onRowClick}
          onSortModelChange={onSortModelChange}
          rows={stockList}
          setSelectedRowIds={setSelectedRowIds}
          selectedRowIds={selectedRowIds}
          setApiRefCurrent={setApiRefCurrent}
          sortModel={sortModel}
          sortingOrder={['asc', 'desc']}
          sx={gridStyles}
          updateSelectedRowIds={updateSelectedRowIds}
        />
      )}
      {stockList.length === 0 && <p className="my-8 text-center text-white">您尚未建立觀察名單，請按右上角「+」</p>}
      <Outlet />
    </>
  );
}
