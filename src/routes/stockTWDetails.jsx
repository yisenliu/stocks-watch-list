import './stocks.sass';
import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import StockContext from '@contexts/StockContext';
import BackToList from '@components/BackToList';
import DividendChart from '@markets/tw/components/DividendChart';
import PriceHistory from '@markets/tw/components/PriceHistory';
import useStockInfo from '@hooks/useStockInfo';
import Loading from '@components/Loading';

export default function StockTWDetails() {
  const { stock_id } = useParams();
  const { market, token } = useContext(StockContext);
  const stocksInfo = useStockInfo('TaiwanStockInfo', token);
  const currentStock = stocksInfo?.data?.filter(stock => stock.stock_id === stock_id.toUpperCase())[0] || null;

  if (stocksInfo.data && !currentStock) {
    throw new Error(`查無 ${stock_id} 資料。`);
  }

  return createPortal(
    <div className="z-2 fixed top-0 left-0 w-screen h-screen overflow-auto bg-white">
      {currentStock && <BackToList to="/tw" currentStock={currentStock} />}
      {stocksInfo.loading && <Loading />}
      {stocksInfo.data && (
        <>
          <div className="px-4 pb-8 space-y-12">
            <DividendChart ticker={stock_id} token={token} />
            <PriceHistory ticker={stock_id} token={token} market={market} />
          </div>
        </>
      )}
      {stocksInfo.error && <p className="my-8 text-center text-red-800">{stocksInfo.error.message}</p>}
    </div>,
    document.body,
  );
}
