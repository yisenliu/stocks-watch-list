import './stocks.sass';
import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import StockContext from '@contexts/StockContext';
import BackToList from '@pages/stocks/components/BackToList';
import DividendChart from '@pages/stocks/tw/components/DividendChart';
import PriceHistory from '@pages/stocks/tw/components/PriceHistory';
import useStockInfo from '@pages/stocks/hooks/useStockInfo';
import Loading from '@components/Loading';

export default function StockTWDetails() {
  const { stock_id } = useParams();
  const { token } = useContext(StockContext);
  const stocksInfo = useStockInfo(token, 'TaiwanStockInfo');
  const currentStock = stocksInfo?.data?.filter(stock => stock.stock_id === stock_id)[0];
  const state = {
    loading: stocksInfo.loading,
    get ready() {
      return !this.loading && currentStock;
    },
    get fail() {
      return this.ready && !currentStock.stock_id;
    },
  };

  return createPortal(
    <div className="z-1 fixed top-0 left-0 w-screen h-screen overflow-auto bg-white">
      <BackToList to="/tw" />
      {state.loading && <Loading />}
      {state.ready && (
        <>
          <p className="my-4 text-center">
            {currentStock.stock_id} {currentStock.stock_name}
          </p>
          {stock_id && (
            <div className="px-4 pb-8 space-y-12">
              <DividendChart ticker={stock_id} token={token} />
              <PriceHistory ticker={stock_id} token={token} />
            </div>
          )}
        </>
      )}
      {state.fail && <p className="my-4 text-center">查無 {stock_id} 資料，請稍後再試。</p>}
    </div>,
    document.body,
  );
}
