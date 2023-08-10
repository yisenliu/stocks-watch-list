import { useEffect, useMemo, useState } from 'react';
import BlockSection from '@components/BlockSection';
import business from 'moment-business';
import Collapse from '@mui/material/Collapse';
import DurationPicker from '@components/DurationPicker';
import ErrorMsg from '@components/ErrorMsg';
import Loading from '@components/Loading';
import moment from 'moment';
import PriceHistoryChart from '@markets/us/components/PriceHistoryChart';
import Summary from '@components/Summary';
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
  const [currentDurationIdx, setCurrentDurationIdx] = useState(
    Number(localStorage.getItem('current_duration_idx')) || 0,
  );
  const [range, setRange] = useState({ min: null, max: null });
  const { data, error, stage } = usePriceHistory({
    ticker,
    token,
    dataset: 'USStockPrice',
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
  const isReady = dataLength > 0;

  function handleChangeDuration(e) {
    const newIdx = Number(e.target.value);
    setCurrentDurationIdx(newIdx);
    localStorage.setItem('current_duration_idx', newIdx);
  }

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
    <Collapse in={currentPriceHistory.length > 0} collapsedSize={90}>
      <BlockSection data-name="price_history" className="text-center">
        {stage === 'fetching' && <Loading />}
        {error && <ErrorMsg>{error.message}</ErrorMsg>}
        {currentPriceHistory.length > 0 && (
          <>
            <Summary
              currentDuration={currentDuration}
              currentValue={currentPriceHistory[currentPriceHistory.length - 1].Close}
              startValue={currentPriceHistory[0].Close}
              endDate={currentPriceHistory[currentPriceHistory.length - 1].date}
              min={range.min}
              max={range.max}
            />
            <PriceHistoryChart history={currentPriceHistory} />
            <DurationPicker options={durations} currentIdx={currentDurationIdx} onChange={handleChangeDuration} />
          </>
        )}
      </BlockSection>
    </Collapse>
  );
}
