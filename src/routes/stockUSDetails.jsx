import './stocks.sass';
import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import StockContext from '@contexts/StockContext';
import BackToList from '@components/BackToList';
import PriceHistory from '@markets/us/components/PriceHistory';
import useStockInfo from '@hooks/useStockInfo';
import Loading from '@components/Loading';

export default function StockUSDetails() {
  const { stock_id } = useParams();
  const { token } = useContext(StockContext);
  const stocksInfo = useStockInfo('USStockInfo', token);
  const currentStock = stocksInfo?.data?.filter(stock => stock.stock_id === stock_id.toUpperCase())[0] || null;

  if (stocksInfo.data && !currentStock) {
    throw new Error(`查無 ${stock_id} 資料。`);
  }

  return createPortal(
    <div className="z-5 fixed top-0 left-0 w-screen h-screen overflow-auto bg-white">
      {currentStock && <BackToList to="/us" currentStock={currentStock} />}
      {stocksInfo.loading && <Loading />}
      {stocksInfo.data && (
        <>
          <div className="px-4 py-8 space-y-12">
            <PriceHistory ticker={stock_id.toUpperCase()} token={token} />
          </div>
        </>
      )}
      {stocksInfo.error && <p className="my-8 text-center text-red-800">{stocksInfo.error.message}</p>}
    </div>,
    document.body,
  );
}
