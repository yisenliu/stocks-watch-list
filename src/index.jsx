import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';

// console.log({
//   VITE_SOME_KEY: import.meta.env.VITE_SOME_KEY, // string
//   SOME_KEY: process.env.SOME_KEY, //number
//   Mode: import.meta.env.MODE,
//   env: process.env,
// });

const root = createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
