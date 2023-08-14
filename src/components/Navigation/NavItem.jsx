import { NavLink } from 'react-router-dom';

export default function NavItem({ noEffect, to, text, onClick, count = 0 }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive, isPending }) => {
        let css = '';
        if (isPending) {
          css += 'pending';
        } else {
          const activeCSS = noEffect ? 'font-bold' : 'bg-primary/80 text-amber-500 font-bold px-4 -mx-4';
          css += isActive ? activeCSS : '';
        }
        return css + ' py-2';
      }}
    >
      {text}
      {count > 0 && <span className="float-right">{count}</span>}
    </NavLink>
  );
}
