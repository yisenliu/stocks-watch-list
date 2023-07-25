import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackToList({ to }) {
  return (
    <div className="w-full h-12 bg-black">
      <Link to={to} className="inline-flex items-center h-12 px-4 text-white">
        <ArrowBackIcon />
      </Link>
    </div>
  );
}
