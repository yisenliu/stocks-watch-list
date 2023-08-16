import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@routes/Dashboard';
import ErrorPage from '@/error-page';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Dashboard />,
      errorElement: <ErrorPage />,
      children: [
        {
          async lazy() {
            let { Index } = await import('./routes/Index');
            return { Component: Index };
          },
          index: true,
        },
        {
          path: 'stock_market/:market',
          async lazy() {
            let { StockList } = await import('./routes/StockList');
            return { Component: StockList };
          },
          children: [
            {
              path: ':stock_id',
              async lazy() {
                let { StockDetails } = await import('./routes/StockDetails');
                return { Component: StockDetails };
              },
              loader: ({ params }) => params.stock_id.toUpperCase(),
            },
          ],
        },
        {
          path: 'us_treasury_bound',
          async lazy() {
            let { TreasuryBoundList } = await import('./routes/TreasuryBoundList');
            return { Component: TreasuryBoundList };
          },
          children: [
            {
              path: ':bound_data_id',
              async lazy() {
                let { TreasuryBound } = await import('./routes/TreasuryBound');
                return { Component: TreasuryBound };
              },
            },
          ],
        },
        {
          path: 'gold_price',
          async lazy() {
            let { GoldPrice } = await import('./routes/GoldPrice');
            return { Component: GoldPrice };
          },
        },
        {
          path: 'crude_oil_prices',
          async lazy() {
            let { CrudeOilPrices } = await import('./routes/CrudeOilPrices');
            return { Component: CrudeOilPrices };
          },
        },
      ],
    },
  ],
  {
    basename: process.env.GithubPages ? '/stocks-watch-list/' : '/',
  },
);
