import { useContext, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import BackToRouteBar from '@components/BackToRouteBar';
import Dividend from '@markets/tw/components/Dividend';
import ErrorMsg from '@components/ErrorMsg';
import Loading from '@components/Loading';
import HistoryInfo from '@components/HistoryInfo';
import StockContext from '@contexts/StockContext';
import Portal from '@components/Portal';
import StockNews from '@markets/tw/components/StockNews';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function getMarketData(market) {
  let fn;
  let component = {
    tw: () => ({ dataset: 'TaiwanStockPrice', dataKey: 'close' }),
    us: () => ({ dataset: 'USStockPrice', dataKey: 'Close' }),
    default() {
      throw new Error('unknown market');
    },
  };

  fn = market ? component[market] : component['default'];

  return fn();
}

export function StockDetails() {
  // console.log('route: StockDetails');
  const stock_id = useLoaderData();
  const { market, stocksInfo, token } = useContext(StockContext);
  const { dataset, dataKey } = getMarketData(market);
  const { data, error, stage } = stocksInfo;
  const currentStock = data?.filter(stock => stock.stock_id === stock_id.toUpperCase())[0] || null;
  const [component, setComponent] = useState(localStorage.getItem(`${market}_details_active_tab`) || 'HistoryInfo');
  const TabPanelComponents = {
    HistoryInfo: <HistoryInfo dataset={dataset} data_id={stock_id} token={token} dataKey={dataKey} />,
    Dividend: <Dividend ticker={stock_id} token={token} />,
    StockNews: <StockNews ticker={stock_id} token={token} />,
  };

  function DynamicTabPanelComponent({ component }) {
    return TabPanelComponents[component];
  }

  function handleTabChange(event, newValue) {
    setComponent(newValue);
    localStorage.setItem(`${market}_details_active_tab`, newValue);
  }

  if (stage === 'fetched' && !currentStock) {
    throw new Error(`查無 ${stock_id} 資料。`);
  }

  return (
    <Portal name="stock_details_portal">
      {currentStock && (
        <BackToRouteBar
          to={`/stock_market/${market}`}
          stock_id={currentStock.stock_id}
          title={currentStock.stock_name}
        />
      )}
      {stage === 'fetching' && <Loading />}
      {error && <ErrorMsg>{error.message}</ErrorMsg>}
      {stage === 'fetched' && (
        <div className="min-h-full pb-8 bg-gray-900">
          <div data-name="tabs" className="z-5 bg-primary sticky top-0 text-white">
            <Tabs
              value={component}
              onChange={handleTabChange}
              TabIndicatorProps={{ sx: { bgcolor: 'white' } }}
              textColor="inherit"
              aria-label="tabs for the stock details"
            >
              <Tab disableRipple label="走勢" value="HistoryInfo" sx={{ fontSize: 16 }} />
              <Tab
                disableRipple
                label="股息"
                value="Dividend"
                sx={{ fontSize: 16, display: market !== 'tw' ? 'none' : 'flex' }}
                disabled={market !== 'tw'}
              />
              <Tab
                disableRipple
                label="新聞"
                value="StockNews"
                sx={{ fontSize: 16, display: market !== 'tw' ? 'none' : 'flex' }}
                disabled={market !== 'tw'}
              />
            </Tabs>
          </div>
          <div
            data-name="tab-panel"
            className="bg-gradient-to-b from-primary from-[60px] via-gray-900 via-[60px] to-gray-900 pt-8 px-2"
          >
            <DynamicTabPanelComponent component={component} key={component} />
          </div>
        </div>
      )}
    </Portal>
  );
}
