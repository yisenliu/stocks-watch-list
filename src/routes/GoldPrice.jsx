import { useEffect, useState } from 'react';
import BackToRouteBar from '@components/BackToRouteBar';
import BlockSection from '@components/BlockSection';
import Collapse from '@mui/material/Collapse';
import ErrorMsg from '@components/ErrorMsg';
import HistoryChart from '@components/HistoryInfo/HistoryChart';
import Loading from '@components/Loading';
import Portal from '@components/Portal';
import Summary from '@components/HistoryInfo/Summary';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useGoldPrice from '@hooks/useGoldPrice';

export function GoldPrice() {
  // console.log('route: GoldPrice');
  const { data, error, stage } = useGoldPrice();
  const [range, setRange] = useState({ min: null, max: null });

  useEffect(() => {
    if (data) {
      let min = null;
      let max = null;

      data.forEach(d => {
        const value = d.close;
        if (!max || value > max) {
          max = value;
        }
        if (!min || value < min) {
          min = value;
        }
      });

      setRange({ min, max });
    }
  }, [data]);

  return (
    <Portal>
      <BackToRouteBar to={-1} title="Gold Price" />
      <div className="min-h-full pb-8 bg-gray-900">
        <div className="z-5 bg-primary sticky top-0 text-white">
          <Tabs
            value="HistoryInfo"
            TabIndicatorProps={{ sx: { bgcolor: 'white' } }}
            textColor="inherit"
            aria-label="tabs for the stock details"
          >
            <Tab label="走勢" value="HistoryInfo" sx={{ fontSize: 16 }} />
          </Tabs>
        </div>
        <div
          data-name="tab-panel"
          className="bg-gray-900 bg-gradient-to-b from-primary from-[60px] via-transparent via-[60px] pt-8 px-2"
        >
          <Collapse in={data} collapsedSize={90}>
            <BlockSection data-name="price_history" className="text-center">
              {stage === 'fetching' && <Loading />}
              {error && <ErrorMsg>{error.message}</ErrorMsg>}
              {data && (
                <>
                  <Summary
                    currentDurationLabel="1年"
                    currentValue={data[data.length - 1].close}
                    startValue={data[0].close}
                    endDate={data[data.length - 1].date}
                    min={range.min}
                    max={range.max}
                  />
                  <HistoryChart history={data} closeKey="close" />
                </>
              )}
            </BlockSection>
          </Collapse>
        </div>
      </div>
    </Portal>
  );
}
