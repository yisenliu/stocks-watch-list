import { useEffect, useMemo, useState } from 'react';
import business from 'moment-business';
import Collapse from '@mui/material/Collapse';
import DurationPicker from '@components/DurationPicker';
import Loading from '@components/Loading';
import moment from 'moment';
import PriceHistoryChart from '@markets/tw/components/PriceHistoryChart';
import PriceSummary from '@components/PriceSummary';
import usePriceHistory from '@hooks/usePriceHistory';

export default function PriceHistory({ ticker, token }) {
  // console.log('component: PriceHistory');
  const durations = [
    { startDate: moment().subtract(moment().dayOfYear() - 1, 'days'), text: 'YTD' },
    { startDate: moment().subtract(1, 'months'), text: '1月' },
    { startDate: moment().subtract(2, 'months'), text: '3月' },
    { startDate: moment().subtract(6, 'months'), text: '6月' },
    { startDate: moment().subtract(1, 'years'), text: '1年' },
    { startDate: moment().subtract(3, 'years'), text: '3年' },
    { startDate: moment().subtract(5, 'years'), text: '5年' },
  ];
  const [currentDurationIdx, setCurrentDurationIdx] = useState(0);
  const [range, setRange] = useState({ min: null, max: null });
  const { data, error, loading } = usePriceHistory({
    ticker,
    token,
    dataset: 'TaiwanStockPrice',
    startDate: moment().subtract(5, 'years').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const allPriceHistory = data ? data.price_history : [];
  const dataLength = allPriceHistory.length;
  const businessDays = business.weekDays(durations[currentDurationIdx].startDate, moment());
  const currentDuration = durations[currentDurationIdx].text;
  const offsetFromEnd = dataLength - businessDays;
  const currentPriceHistory = useMemo(
    () => allPriceHistory.slice(offsetFromEnd > 0 ? offsetFromEnd : 0, dataLength),
    [offsetFromEnd],
  );
  const darkTheme = true;
  const isReady = dataLength > 0;
  const handleChangeDuration = e => {
    setCurrentDurationIdx(Number(e.target.value));
  };

  useEffect(() => {
    let min = null;
    let max = null;

    currentPriceHistory.forEach(history => {
      const close = history.close;
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
    <Collapse in={currentPriceHistory.length > 0} collapsedSize={90}>
      <div className="py-4 mx-4 text-center bg-gray-800">
        {loading && <Loading darkTheme={darkTheme} />}
        {error && (
          <p className="my-4">
            <span className={darkTheme ? 'text-white' : 'text-red-800'}>{error.message}</span>
          </p>
        )}
        {currentPriceHistory.length > 0 && (
          <>
            <PriceSummary
              currentDuration={currentDuration}
              currentPrice={currentPriceHistory[currentPriceHistory.length - 1].close}
              startPrice={currentPriceHistory[0].close}
              endDate={currentPriceHistory[currentPriceHistory.length - 1].date}
              min={range.min}
              max={range.max}
            />
            <PriceHistoryChart history={currentPriceHistory} />
            <DurationPicker options={durations} currentIdx={currentDurationIdx} onChange={handleChangeDuration} />
          </>
        )}
      </div>
    </Collapse>
  );
}
