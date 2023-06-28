export default function ({ params }) {
  const stock_id = params.stock_id || null;
  return { stock_id };
}
