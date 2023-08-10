import './stockDetails.sass';
import { useContext, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import BackToStockList from '@components/BackToStockList';
import ErrorMsg from '@components/ErrorMsg';
import Loading from '@components/Loading';
import PriceHistory from '@components/PriceHistory';
import StockContext from '@contexts/StockContext';
import Portal from '@components/Portal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function StockDetailsUS() {
  // console.log('route: StockDetailsUS');
  const stock_id = useLoaderData();
  const { market, stocksInfo, token } = useContext(StockContext);
  const { data, error, stage } = stocksInfo;
  const currentStock = data?.filter(stock => stock.stock_id === stock_id.toUpperCase())[0] || null;
  const [component, setComponent] = useState(localStorage.getItem(`${market}_details_active_tab`) || 'PriceHistory');
  const TabPanelComponents = {
    PriceHistory: <PriceHistory market={market} ticker={stock_id} token={token} />,
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
    <Portal>
      {currentStock && <BackToStockList to="/us" currentStock={currentStock} />}
      {stage === 'fetching' && <Loading />}
      {stage === 'fetched' && (
        <div className="min-h-full pb-8 bg-gray-900">
          <div className="z-5 bg-primary sticky top-0 text-white">
            <Tabs
              value={component}
              onChange={handleTabChange}
              TabIndicatorProps={{ sx: { bgcolor: 'white' } }}
              textColor="inherit"
              aria-label="tabs for the stock details"
            >
              <Tab label="走勢" value="PriceHistory" sx={{ fontSize: 16 }} />
            </Tabs>
          </div>
          <div
            data-name="tab-panel"
            className="bg-gray-900 bg-gradient-to-b from-primary from-[60px] via-transparent via-[60px] pt-8 px-2"
          >
            <DynamicTabPanelComponent component={component} key={component} />
          </div>
        </div>
      )}
      {error && <ErrorMsg>{error.message}</ErrorMsg>}
    </Portal>
  );
}
