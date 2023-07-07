export function getStockInfoDataSetByMarket(market) {
  let fn;
  let dataset = {
    tw() {
      return 'TaiwanStockInfo';
    },
    us() {
      return 'USStockInfo';
    },
    default() {
      console.log('unknown market');
      return null;
    },
  };
  fn = dataset[market] ? dataset[market] : dataset['default'];

  return fn();
}
export function getStockPriceDataSetByMarket(market) {
  let fn;
  let dataset = {
    tw() {
      return 'TaiwanStockPrice';
    },
    us() {
      return 'USStockPrice';
    },
    default() {
      console.log('unknown market');
      return null;
    },
  };
  fn = dataset[market] ? dataset[market] : dataset['default'];

  return fn();
}
