import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/error-page';
import Dashboard from '@routes/Dashboard';
import Index from '@routes/Index';
import StockList from '@routes/stockList';
import StockTWDetails from '@routes/stockTWDetails';
import StockUSDetails from '@routes/stockUSDetails';

console.log(process.env);

export const router = createBrowserRouter([
  {
    path: process.env.isGithubPages ? 'stocks-watch-list' : '/',
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
]);
