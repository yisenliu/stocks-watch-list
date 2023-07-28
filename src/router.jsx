import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/error-page';
import Dashboard from '@routes/Dashboard';
import Index from '@routes/Index';
import StockList from '@routes/stockList';
import StockTWDetails from '@routes/stockTWDetails';
import StockUSDetails from '@routes/stockUSDetails';

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
          path: 'tw',
          element: <StockList />,
          children: [
            {
              path: ':stock_id',
              element: <StockTWDetails />,
            },
          ],
        },
        {
          path: 'us',
          element: <StockList />,
          children: [
            {
              path: ':stock_id',
              element: <StockUSDetails />,
            },
          ],
        },
      ],
    },
  ],
  // {
  //   basename: process.env.isGithubPages ? '/stocks-watch-list' : '/',
  // },
);
