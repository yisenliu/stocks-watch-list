import './stockDetails.sass';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockSection from '@components/BlockSection';
import ErrorMsg from '@components/ErrorMsg';
import Loading from '@components/Loading';
import Portal from '@components/Portal';
import StockContext from '@contexts/StockContext';
import Summary from '@components/Summary';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TreasuryBoundHistoryChart from '@components/TreasuryBoundHistoryChart';
import useTreasuryBondsYield from '@markets/us/hooks/useTreasuryBondsYield';

export default function TreasuryBound() {
  // console.log('route: TreasuryBound');
  const { bound_data_id } = useParams();
  const { token } = useContext(StockContext);
  const { data, error, stage } = useTreasuryBondsYield(bound_data_id, token);
  const [range, setRange] = useState({ min: null, max: null });

  useEffect(() => {
    if (data) {
      let min = null;
      let max = null;

      data.forEach(d => {
        const value = d.value;
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
      <div className="items-center grid w-full h-12 grid-cols-[60px_1fr_60px] bg-primary">
        <Link to="/us_treasury_bound" className="py-3 text-sm text-center text-white">
          <ArrowBackIcon />
        </Link>
        <h2 className="text-lg leading-tight text-white">{bound_data_id}</h2>
      </div>
      <div className="min-h-full pb-8 bg-gray-900">
        <div className="z-5 bg-primary sticky top-0 text-white">
          <Tabs
            value="PriceHistory"
            TabIndicatorProps={{ sx: { bgcolor: 'white' } }}
            textColor="inherit"
            aria-label="tabs for the stock details"
          >
            <Tab label="走勢" value="PriceHistory" sx={{ fontSize: 16 }} />
          </Tabs>
        </div>
        <div
          data-name="tab-panel"
          className="bg-gray-900 bg-gradient-to-b from-primary from-[60px] via-transparent via-[60px] pt-8 px-2"
        >
          <BlockSection className="text-center">
            {stage === 'fetching' && <Loading />}
            {stage === 'fetched' && (
              <>
                <Summary
                  currentDuration="1Y"
                  currentValue={data[data.length - 1].value}
                  startValue={data[0].value}
                  endDate={data[data.length - 1].date}
                  min={range.min}
                  max={range.max}
                />
                <TreasuryBoundHistoryChart history={data} />
              </>
            )}
            {error && <ErrorMsg>{error.message}</ErrorMsg>}
          </BlockSection>
        </div>
      </div>
    </Portal>
  );
}
