export default function Container({ children }) {
  return (
    <div data-name="page" className="flex flex-col w-full h-screen overflow-x-hidden overflow-y-auto">
      {children}
    </div>
  );
}
