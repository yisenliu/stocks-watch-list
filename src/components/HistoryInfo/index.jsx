import { useEffect, useMemo, useState } from 'react';
import BlockSection from '@components/BlockSection';
import business from 'moment-business';
import Collapse from '@mui/material/Collapse';
import DurationPicker from '@components/HistoryInfo/DurationPicker';
import ErrorMsg from '@components/ErrorMsg';
import HistoryChart from './HistoryChart';
import Loading from '@components/Loading';
import moment from 'moment';
import Summary from './Summary';
import usePriceHistory from '@hooks/usePriceHistory';

const durations = [
  { startDate: moment().subtract(moment().dayOfYear() - 1, 'days'), text: 'YTD' },
  { startDate: moment().subtract(1, 'months'), text: '1月' },
  { startDate: moment().subtract(2, 'months'), text: '3月' },
  { startDate: moment().subtract(6, 'months'), text: '6月' },
  { startDate: moment().subtract(1, 'years'), text: '1年' },
  { startDate: moment().subtract(3, 'years'), text: '3年' },
  { startDate: moment().subtract(5, 'years'), text: '5年' },
];

export default function HistoryInfo({ dataset, data_id, dataKey, token, tooltipValueLabel }) {
  // console.log('component: HistoryInfo');
  const [currentDurationIdx, setCurrentDurationIdx] = useState(
    Number(localStorage.getItem('current_duration_idx')) || 0,
  );
  const [range, setRange] = useState({ min: null, max: null });
  const { data, error, stage } = usePriceHistory({
    dataset,
    data_id,
    token,
  });
  const histories = data || [];
  const dataLength = histories.length;
  const businessDays = business.weekDays(durations[currentDurationIdx].startDate, moment());
  const currentDurationLabel = durations[currentDurationIdx].text;
  const offsetFromEnd = dataLength - businessDays;
  const currentHistory = useMemo(
    () => histories.slice(offsetFromEnd > 0 ? offsetFromEnd : 0, dataLength),
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

    currentHistory.forEach(history => {
      const value = history[dataKey];
      if (!max || value > max) {
        max = value;
      }
      if (!min || value < min) {
        min = value;
      }
    });

    setRange({ min, max });
  }, [isReady, currentDurationIdx]);

  return (
    <Collapse in={currentHistory.length > 0} collapsedSize={90}>
      <BlockSection data-name="price_history" className="text-center">
        {stage === 'fetching' && <Loading />}
        {error && <ErrorMsg>{error.message}</ErrorMsg>}
        {currentHistory.length > 0 && (
          <>
            <Summary
              currentDurationLabel={currentDurationLabel}
              currentValue={currentHistory[currentHistory.length - 1][dataKey]}
              startValue={currentHistory[0][dataKey]}
              endDate={currentHistory[currentHistory.length - 1].date}
              min={range.min}
              max={range.max}
            />
            <HistoryChart history={currentHistory} dataKey={dataKey} tooltipValueLabel={tooltipValueLabel} />
            <DurationPicker options={durations} currentIdx={currentDurationIdx} onChange={handleChangeDuration} />
          </>
        )}
      </BlockSection>
    </Collapse>
  );
}
