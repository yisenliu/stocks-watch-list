import { createBrowserRouter } from 'react-router-dom';
import CrudeOilPrices from '@routes/CrudeOilPrices';
import Dashboard from '@routes/Dashboard';
import ErrorPage from '@/error-page';
import GoldPrice from '@routes/GoldPrice';
import Index from '@routes/Index';
import StockList from '@routes/StockList';
import StockDetails from '@routes/StockDetails';
import TreasuryBound from '@routes/TreasuryBound';
import TreasuryBoundList from '@routes/TreasuryBoundList';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Dashboard />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: <Index />,
          index: true,
        },
        {
          path: 'stock_market/:market',
          element: <StockList />,
          children: [
            {
              path: ':stock_id',
              element: <StockDetails />,
              loader: ({ params }) => params.stock_id.toUpperCase(),
            },
          ],
        },
        {
          path: 'us_treasury_bound',
          element: <TreasuryBoundList />,
          children: [
            {
              path: ':bound_data_id',
              element: <TreasuryBound />,
            },
          ],
        },
        {
          path: 'gold_price',
          element: <GoldPrice />,
        },
        {
          path: 'crude_oil_prices',
          element: <CrudeOilPrices />,
        },
      ],
    },
  ],
  {
    basename: process.env.GithubPages ? '/stocks-watch-list/' : '/',
  },
);
