import { useCallback, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { DataGridPro, gridPaginatedVisibleSortedGridRowIdsSelector, useGridApiRef } from '@mui/x-data-grid-pro';
import { debounce } from 'lodash';
import { useSwipeable } from 'react-swipeable';
import { columns, gridStyles } from '@pages/stocks/dataGrid';
import fetch from '@utils/fetch';
import moment from 'moment';
import StockContext from '@contexts/StockContext';
import SelectedStocksStatistics from '@pages/stocks/components/SelectedStocksStatistics';

export default function StockUSList() {
  const [enableSwipe, setEnableSwipe] = useState(false);
  const [swapIdx, setSwapIdx] = useState(null);
  const [currentDir, setCurrentDir] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [sortModel, setSortModel] = useState([]);
  const [pageRowTops, setPageRowTops] = useState([]);
  const { market, watchList, setWatchList, token } = useContext(StockContext);
  const apiRef = useGridApiRef();
  const dealDragRow = useCallback(
    debounce((target, rowHeight, dir) => {
      if (dir === 'Up') {
        for (let i = target.index - 1; i >= 0; i--) {
          if (target.top <= pageRowTops[i].top + rowHeight) {
            const overlapElement = apiRef.current.getRowElement(pageRowTops[i].id);
            overlapElement.style.transform = `translateY(${rowHeight}px)`;
            setSwapIdx(getRealIndexInMarket(market, pageRowTops[i].id));
            setSortModel([]);
          }
        }
      }
      if (dir === 'Down') {
        for (let i = target.index + 1; i < pageRowTops.length; i++) {
          if (target.top >= pageRowTops[i].top) {
            const overlapElement = apiRef.current.getRowElement(pageRowTops[i].id);
            overlapElement.style.transform = `translateY(-${rowHeight}px)`;
            setSwapIdx(getRealIndexInMarket(market, pageRowTops[i].id));
            setSortModel([]);
          }
        }
      }
    }, 100),
    [pageRowTops],
  );
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const stockList = watchList[market];
  let stocksNum = stockList?.length;
  const swipeHandlers = useSwipeable({
    onSwipeStart({ dir }) {
      if (!enableSwipe) {
        clearInterval(apiRef.current.timerId);
      } else {
        setCurrentDir(dir);
      }
    },
    onSwiping({ event, dir, deltaY }) {
      if (enableSwipe) {
        const domRect = event.target.getBoundingClientRect();
        const rowHeight = domRect.height;
        const target = {
          top: domRect.top,
          index: apiRef.current.getRowIndexRelativeToVisibleRows(selectedRowId),
          dom: apiRef.current.selectedRowElement,
        };

        target.dom.style.transform = `translateY(${deltaY}px)`;
        target.dom.style.opacity = 0.8;
        setCurrentDir(dir);
        dealDragRow(target, rowHeight, dir);
      }
    },
    onTouchStartOrOnMouseDown({ event }) {
      console.clear();
      let timer = 0;
      let ms = 100;
      let rowEl = event.target.closest('.MuiDataGrid-row');
      const rowId = rowEl?.dataset.id;
      const pageRowIds = gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);
      setPageRowTops(() => {
        const rows = document.querySelectorAll('.MuiDataGrid-row');
        return pageRowIds.map((id, index) => ({
          id,
          top: rows[index].getBoundingClientRect().top,
        }));
      });

      apiRef.current.timerId = setInterval(() => {
        timer += ms;
        if (timer >= 500) {
          setSelectedRowId(rowId);
          setSwapIdx(getRealIndexInMarket(market, rowId));
          if (selectedRowIds.includes(rowId)) {
            // remove from selection
            setSelectedRowIds(ids => ids.filter(id => id !== rowId));
            apiRef.current.selectedRowElement = null;
          } else {
            // add to selection
            setSelectedRowIds([...selectedRowIds, rowId]);
            apiRef.current.selectedRowElement = rowEl;
          }
          clearInterval(apiRef.current.timerId);
        }
      }, ms);
    },
    onTouchEndOrOnMouseUp() {
      // console.log('onTouchEndOrOnMouseUp');
      const selectedRowIndex = getRealIndexInMarket(market, selectedRowId);
      if (enableSwipe && selectedRowIndex !== swapIdx) {
        // move data into index of watch list
        const newData = [...watchList[market]];
        const dataToMove = newData.splice(selectedRowIndex, 1)[0];

        newData.splice(swapIdx, 0, dataToMove);
        updateWatchList(market, newData);
        clearSelectedRowIds();
      }
      setEnableSwipe(false);
      setSelectedRowId(null);
      setCurrentDir(null);
      clearInterval(apiRef.current.timerId);
    },
  });
  function clearSelectedRowIds() {
    setSelectedRowIds([]);
  }
  function getRealIndexInMarket(market, id) {
    return watchList[market].findIndex(item => item.id === id);
  }
  const getStockPrice = ticker => {
    return fetch({
      url: '/api/stock',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      params: {
        dataset: 'USStockPrice',
        data_id: ticker,
        start_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      },
    })
      .then(res => res.data.data)
      .then(data => {
        const latest = data[data.length - 1];

        if (latest) {
          const { stock_id, Close, Open } = latest;
          return { id: stock_id, spread: Close - Open, close: Close, open: Open };
        }
        return { id: ticker, spread: '-', close: '-', open: '-' };
      });
  };
  async function onSortModelChange(newSortModel) {
    await setSortModel(newSortModel);
    updateWatchList(market, apiRef.current.getSortedRows());
  }
  function resetRowStyles() {
    const pageRowIds = gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);
    pageRowIds.forEach(id => {
      const rowEl = apiRef.current.getRowElement(id);
      if (rowEl) {
        rowEl.style.removeProperty('transform');
        rowEl.style.removeProperty('opacity');
      }
    });
  }
  function updateWatchList(market, data) {
    const newList = { [market]: data };
    localStorage.setItem(`stocks_${market}`, JSON.stringify(data));
    setWatchList(list => ({ ...list, ...newList }));
  }

  useEffect(() => {
    if (stocksNum > 0) {
      const rowsPromise = stockList.map(item => {
        return getStockPrice(item.id);
      });
      Promise.all(rowsPromise).then(data => {
        const newList = { [market]: data };
        localStorage.setItem(`stocks_${market}`, JSON.stringify(data));
        setWatchList(list => ({ ...list, ...newList }));
      });
    }
  }, [stocksNum]);

  useEffect(() => {
    apiRef.current.setRowSelectionModel(selectedRowIds);
  }, [selectedRowIds, pathname]);

  useEffect(() => {
    resetRowStyles();
  }, [currentDir]);

  useEffect(() => {
    setEnableSwipe(selectedRowIds.length === 1);
  }, [selectedRowIds]);

  return (
    <>
      {selectedRowIds.length > 0 && (
        <SelectedStocksStatistics clearSelectedRowIds={clearSelectedRowIds} selectedRowIds={selectedRowIds} />
      )}
      <div className="-m-4" {...swipeHandlers}>
        {stockList !== null && (
          <DataGridPro
            apiRef={apiRef}
            columns={columns}
            disableColumnMenu
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            onRowClick={params => {
              navigate(`/${market}/${params.id}`);
            }}
            onSortModelChange={onSortModelChange}
            pageSizeOptions={[5, 10, 20]}
            pagination={true}
            rows={stockList}
            sortModel={sortModel}
            sx={gridStyles}
          />
        )}
        <Outlet />
      </div>
    </>
  );
}
