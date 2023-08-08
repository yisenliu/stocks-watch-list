import { useRouteError } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ErrorMsg from '@components/ErrorMsg';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="mt-24 space-y-8 text-center text-white">
      <h1 className="text-5xl font-bold">
        <ErrorOutlineIcon fontSize="inherit" color="inherit" />
      </h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <ErrorMsg>{error.statusText || error.message}</ErrorMsg>
    </div>
  );
}
