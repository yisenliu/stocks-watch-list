import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/error-page';
import Dashboard from '@routes/Dashboard';
import Index from '@routes/Index';
// import stockLoader from '@routes/stockLoader';
import StockTWList from '@routes/stockTWList';
import StockTWDetails from '@routes/stockTWDetails';
import StockUSList from '@routes/stockUSList';
import StockUSDetails from '@routes/stockUSDetails';
import CSSModules from '@routes/CSSModules';

export const router = createBrowserRouter([
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
        path: 'cssmodules',
        element: <CSSModules />,
      },
      {
        path: 'tw',
        element: <StockTWList />,
        children: [
          {
            path: ':stock_id',
            // loader: stockLoader,
            element: <StockTWDetails />,
          },
        ],
      },
      {
        path: 'us',
        element: <StockUSList />,
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
