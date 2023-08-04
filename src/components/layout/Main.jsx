export default function main({ children }) {
  return (
    <main data-name="content" className="flex-grow p-4 bg-gray-800">
      {children}
    </main>
  );
}
