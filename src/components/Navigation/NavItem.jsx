import { NavLink } from 'react-router-dom';

export default function NavItem({ to, text, onClick, count = 0 }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive, isPending }) =>
        isPending ? 'pending' : isActive ? 'text-primary font-bold py-2' : 'py-2'
      }
    >
      {text}
      {count > 0 && <span className="float-right">{count}</span>}
    </NavLink>
  );
}
