export default function Container({ children }) {
  return <div className="flex flex-col w-full h-screen overflow-x-hidden overflow-y-auto bg-gray-900">{children}</div>;
}
