export default function NavGroup({ name, children }) {
  return (
    <div data-name="nav-group" className="flex flex-col py-2 space-y-2">
      {name && <h3 className="text-sm text-gray-600">{name}</h3>}
      {children}
    </div>
  );
}
