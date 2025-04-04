import { useParams } from 'react-router-dom';
import BackToRouteBar from '@components/BackToRouteBar';
import HistoryInfo from '@components/HistoryInfo';
import Portal from '@components/Portal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export function TreasuryBound() {
  // console.log('route: TreasuryBound');
  const { bound_data_id } = useParams();

  return (
    <Portal name="treasury_bound_protal">
      <BackToRouteBar to="/us_treasury_bound" title={bound_data_id} />
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
          <HistoryInfo
            dataset="GovernmentBondsYield"
            data_id={bound_data_id}
            closeKey="value"
            maxKey="value"
            minKey="value"
            tooltipValueLabel="殖利率"
          />
        </div>
      </div>
    </Portal>
  );
}
