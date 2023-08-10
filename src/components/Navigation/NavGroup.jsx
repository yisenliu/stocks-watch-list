export default function NavGroup({ name, children }) {
  return (
    <div data-name="nav-group" className="flex flex-col my-2 space-y-2">
      <h3 className="pt-2 text-sm text-gray-600 border-t border-gray-800">{name}</h3>
      {children}
    </div>
  );
}
