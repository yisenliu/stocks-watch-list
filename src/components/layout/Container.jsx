export default function Container({ children }) {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-black flex flex-col w-full h-screen overflow-x-hidden overflow-y-auto">
      {children}
    </div>
  );
}
