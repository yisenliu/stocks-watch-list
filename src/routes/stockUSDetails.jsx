import './stocks.sass';
import { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import StockContext from '@contexts/StockContext';
import BackToList from '@components/BackToList';
import Loading from '@components/Loading';
import PriceHistory from '@markets/us/components/PriceHistory';
// import PriceHistory from '@components/PriceHistory';
import useStockInfo from '@hooks/useStockInfo';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function StockUSDetails() {
  const { stock_id } = useParams();
  const { token } = useContext(StockContext);
  const stocksInfo = useStockInfo('USStockInfo', token);
  const currentStock = stocksInfo?.data?.filter(stock => stock.stock_id === stock_id.toUpperCase())[0] || null;
  const [value, setValue] = useState('price_history');

  function handleTabChange(event, newValue) {
    setValue(newValue);
  }

  function TabPanelComponent({ value }) {
    switch (value) {
      case 'price_history':
        return <PriceHistory ticker={stock_id.toUpperCase()} token={token} />;
      // case 'dividend_chart':
      //   return <DividendChart ticker={stock_id} token={token} />;
      // case '2':
      //   return <PriceHistory ticker={stock_id} />;
    }
  }

  if (stocksInfo.data && !currentStock) {
    throw new Error(`查無 ${stock_id} 資料。`);
  }

  return createPortal(
    <div className="z-2 fixed top-0 left-0 w-screen h-screen overflow-auto bg-white">
      {currentStock && <BackToList to="/us" currentStock={currentStock} />}
      {stocksInfo.loading && <Loading />}
      {stocksInfo.data && (
        <div className="h-full pb-8 bg-gray-900">
          <div className="z-5 bg-primary sticky top-0 text-white">
            <Tabs
              value={value}
              onChange={handleTabChange}
              TabIndicatorProps={{ sx: { bgcolor: 'white' } }}
              textColor="inherit"
              aria-label="tabs for the stock details"
            >
              <Tab label="資訊" value="price_history" sx={{ fontSize: 16 }} />
              {/* <Tab label="股息" value="dividend_chart" sx={{ fontSize: 16 }} /> */}
              {/* <Tab label="新聞" value="news" sx={{fontSize: 16}}/> */}
            </Tabs>
          </div>
          <div className="bg-gray-900 bg-gradient-to-b from-primary from-[60px] via-transparent via-[60px] pt-8">
            <TabPanelComponent value={value} key={value} />
          </div>
        </div>
      )}
      {stocksInfo.error && <p className="my-8 text-center text-red-800">{stocksInfo.error.message}</p>}
    </div>,
    document.body,
  );
}
