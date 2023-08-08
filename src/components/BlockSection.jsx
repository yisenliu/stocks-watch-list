export default function BlockSection({ children, className, ...rest }) {
  return (
    <div className={`p-4 bg-gray-800 ${className}`} {...rest}>
      {children}
    </div>
  );
}
