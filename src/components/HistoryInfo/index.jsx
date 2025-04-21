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

export default function HistoryInfo({ dataset, data_id, closeKey, token, tooltipValueLabel }) {
  const [currentDurationIdx, setCurrentDurationIdx] = useState(
    parseInt(localStorage.getItem('current_duration_idx')) || 0,
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
  const currentHistory = useMemo(() => {
    if (durations[currentDurationIdx].text === 'YTD') {
      const startIndex = histories.findIndex(history => history.date.includes(moment().year()));
      return histories.slice(startIndex, dataLength);
    }
    return histories.slice(offsetFromEnd > 0 ? offsetFromEnd : 0, dataLength);
  }, [offsetFromEnd]);
  const isReady = dataLength > 0;

  function handleChangeDuration(e) {
    const newIdx = parseInt(e.target.value);
    setCurrentDurationIdx(newIdx);
    localStorage.setItem('current_duration_idx', newIdx);
  }

  useEffect(() => {
    let min = null;
    let max = null;
    currentHistory.forEach(history => {
      const h_max = history[closeKey];
      const h_min = history[closeKey];
      if (!max || h_max > max) {
        max = h_max;
      }
      if (!min || h_min < min) {
        min = h_min;
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
              currentValue={currentHistory[currentHistory.length - 1][closeKey]}
              startValue={currentHistory[0][closeKey]}
              endDate={currentHistory[currentHistory.length - 1].date}
              min={range.min}
              max={range.max}
            />
            <HistoryChart history={currentHistory} closeKey={closeKey} tooltipValueLabel={tooltipValueLabel} />
            <DurationPicker options={durations} currentIdx={currentDurationIdx} onChange={handleChangeDuration} />
          </>
        )}
      </BlockSection>
    </Collapse>
  );
}
