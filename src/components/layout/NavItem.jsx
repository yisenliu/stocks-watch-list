import { NavLink } from 'react-router-dom';

export default function NavItem({ to, text, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'text-primary font-bold' : '')}
    >
      {text}
    </NavLink>
  );
}
