import { useState } from 'react';
import BackToRouteBar from '@components/BackToRouteBar';
import HistoryInfo from '@components/HistoryInfo';
import Portal from '@components/Portal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export function CrudeOilPrices() {
  // console.log('route: CrudeOilPrices');
  const [component, setComponent] = useState(localStorage.getItem('crude_oil_prices_active_tab') || 'Brent');
  const TabPanelComponents = {
    Brent: (
      <HistoryInfo
        dataset="CrudeOilPrices"
        data_id="Brent"
        maxKey="price"
        minKey="price"
        closeKey="price"
        tooltipValueLabel="價格"
      />
    ),
    WTI: (
      <HistoryInfo
        dataset="CrudeOilPrices"
        data_id="WTI"
        maxKey="price"
        minKey="price"
        closeKey="price"
        tooltipValueLabel="價格"
      />
    ),
  };

  function DynamicTabPanelComponent({ component }) {
    return TabPanelComponents[component];
  }
  function handleTabChange(event, newValue) {
    setComponent(newValue);
    localStorage.setItem('crude_oil_prices_active_tab', newValue);
  }

  return (
    <Portal name="crude_oil_prices_portal">
      <BackToRouteBar to={-1} title="Crude Oil Price" />
      <div className="min-h-full pb-8 bg-gray-900">
        <div className="z-5 bg-primary sticky top-0 text-white">
          <Tabs
            value={component}
            onChange={handleTabChange}
            TabIndicatorProps={{ sx: { bgcolor: 'white' } }}
            textColor="inherit"
            aria-label="tabs for the crude oil"
          >
            <Tab label="Brent" value="Brent" sx={{ fontSize: 16, textTransform: 'capitalize' }} />
            <Tab label="WTI" value="WTI" sx={{ fontSize: 16, textTransform: 'capitalize' }} />
          </Tabs>
        </div>
        <div
          data-name="tab-panel"
          className="bg-gray-900 bg-gradient-to-b from-primary from-[60px] via-transparent via-[60px] pt-8 px-2"
        >
          <DynamicTabPanelComponent component={component} key={component} />
        </div>
      </div>
    </Portal>
  );
}
