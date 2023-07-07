import { useEffect, useMemo, useState } from 'react';
import StackDuration from '@pages/stocks/components/StackDuration';
import moment from 'moment';
import business from 'moment-business';
import Loading from '@components/Loading';
import PriceHistoryChart from '@pages/stocks/us/components/PriceHistoryChart';
import PriceSummary from '@pages/stocks/components/PriceSummary';
import usePriceHistory from '@hooks/usePriceHistory';

export default function PriceHistory({ ticker, token }) {
  const durations = [
    { startDate: moment().subtract(moment().dayOfYear() - 1, 'days'), text: 'YTD' },
    { startDate: moment().subtract(1, 'months'), text: '1M' },
    { startDate: moment().subtract(2, 'months'), text: '3M' },
    { startDate: moment().subtract(6, 'months'), text: '6M' },
    { startDate: moment().subtract(1, 'years'), text: '1Y' },
    { startDate: moment().subtract(3, 'years'), text: '3Y' },
  ];
  const [currentDurationIdx, setCurrentDurationIdx] = useState(0);
  const [range, setRange] = useState({ min: null, max: null });
  const { data, error, loading } = usePriceHistory({
    ticker,
    token,
    dataset: 'USStockPrice',
    startDate: moment().subtract(3, 'years').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const allPriceHistory = data ? data.price_history : [];
  const dataLength = allPriceHistory.length;
  const businessDays = business.weekDays(durations[currentDurationIdx].startDate, moment());
  const offsetFromEnd = dataLength - businessDays;
  const currentPriceHistory = useMemo(
    () => allPriceHistory.slice(offsetFromEnd > 0 ? offsetFromEnd : 0, dataLength),
    [offsetFromEnd],
  );
  const isReady = dataLength > 0;
  const handleChangeDuration = e => {
    setCurrentDurationIdx(Number(e.target.value));
  };

  useEffect(() => {
    let min = null;
    let max = null;

    currentPriceHistory.forEach(history => {
      const close = history.Close;
      if (!max || close > max) {
        max = close;
      }
      if (!min || close < min) {
        min = close;
      }
    });

    setRange({ min, max });
  }, [isReady, currentDurationIdx]);

  return (
    <div className="text-center">
      <StackDuration options={durations} currentIdx={currentDurationIdx} onChange={handleChangeDuration} />
      {loading && <Loading />}
      {error && (
        <p className="my-4">
          <span className="text-red-800">{error.message}</span>
        </p>
      )}
      {currentPriceHistory.length > 0 && (
        <>
          <PriceSummary
            currentPrice={currentPriceHistory[currentPriceHistory.length - 1].Close}
            startPrice={currentPriceHistory[0].Close}
            endDate={currentPriceHistory[currentPriceHistory.length - 1].date}
            min={range.min}
            max={range.max}
          />
          <PriceHistoryChart history={currentPriceHistory} />
        </>
      )}
    </div>
  );
}
