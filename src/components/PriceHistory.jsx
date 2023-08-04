import { useContext, useEffect, useMemo, useState } from 'react';
import { getStockPriceDataSetByMarket } from '@utils/getDataSetByMarket';
import business from 'moment-business';
import moment from 'moment';
import Loading from '@components/Loading';
import PriceHistoryChartTW from '@markets/tw/components/PriceHistoryChart';
import PriceHistoryChartUS from '@markets/us/components/PriceHistoryChart';
import PriceSummary from '@components/PriceSummary';
import DurationPicker from '@components/DurationPicker';
import StockContext from '@contexts/StockContext';
import usePriceHistory from '@hooks/usePriceHistory';

function getPriceHistoryChartByMarket(market) {
  let fn;
  const component = {
    tw: () => PriceHistoryChartTW,
    us: () => PriceHistoryChartUS,
    default: () => {
      throw new Error(`Market "${market}" service is not available now.`);
    },
  };

  fn = market ? component[market] : component['default'];
  return fn();
}
function getPriceSummaryPropsByMarket(market, currentDuration, currentPriceHistory, range) {
  let fn;
  const props = {
    tw() {
      return {
        currentDuration,
        currentPrice: currentPriceHistory[currentPriceHistory.length - 1].close,
        startPrice: currentPriceHistory[0].close,
        endDate: currentPriceHistory[currentPriceHistory.length - 1].date,
        min: range.min,
        max: range.max,
      };
    },
    us() {
      return {
        currentDuration,
        currentPrice: currentPriceHistory[currentPriceHistory.length - 1].Close,
        startPrice: currentPriceHistory[0].Close,
        endDate: currentPriceHistory[currentPriceHistory.length - 1].date,
        min: range.min,
        max: range.max,
      };
    },
    default() {
      throw new Error(`Market "${market}" service is not available now.`);
    },
  };
  fn = market ? props[market] : props['default'];
  return fn();
}

export default function PriceHistory({ ticker }) {
  // console.log('component: PriceHistory');
  const { market, token } = useContext(StockContext);
  const dataset = getStockPriceDataSetByMarket(market);
  const PriceHistoryChart = getPriceHistoryChartByMarket(market);
  const durations = [
    { startDate: moment().subtract(moment().dayOfYear() - 1, 'days'), text: 'YTD' },
    { startDate: moment().subtract(1, 'months'), text: '1月' },
    { startDate: moment().subtract(2, 'months'), text: '3月' },
    { startDate: moment().subtract(6, 'months'), text: '6月' },
    { startDate: moment().subtract(1, 'years'), text: '1年' },
    { startDate: moment().subtract(3, 'years'), text: '3年' },
  ];
  const [currentDurationIdx, setCurrentDurationIdx] = useState(0);
  const [range, setRange] = useState({ min: null, max: null });
  const { data, error, loading } = usePriceHistory({
    ticker,
    token,
    dataset,
    startDate: moment().subtract(3, 'years').format('YYYY-MM-DD'),
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
  const isReady = dataLength > 0;
  const props =
    currentPriceHistory.length > 0
      ? getPriceSummaryPropsByMarket(market, currentDuration, currentPriceHistory, range)
      : null;

  function handleChangeDuration(e) {
    setCurrentDurationIdx(Number(e.target.value));
  }

  useEffect(() => {
    let min = null;
    let max = null;

    currentPriceHistory.forEach(history => {
      const close = history.close || history.Close;
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
    <div className="py-4 mx-4 text-center bg-gray-800">
      {loading && <Loading darkTheme />}
      {error && (
        <p className="my-4">
          <span className="text-red-800">{error.message}</span>
        </p>
      )}
      {currentPriceHistory.length > 0 && (
        <>
          <PriceSummary {...props} />
          <PriceHistoryChart history={currentPriceHistory} />
          <DurationPicker options={durations} currentIdx={currentDurationIdx} onChange={handleChangeDuration} />
        </>
      )}
    </div>
  );
}
