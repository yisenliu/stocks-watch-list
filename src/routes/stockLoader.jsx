export default function (arg) {
  console.log(arg);
  const stock_id = arg.params.stock_id || null;
  return { stock_id };
}
