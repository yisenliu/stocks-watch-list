export function getStockInfoDatasetByMarket(market) {
  let fn;
  let dataset = {
    tw() {
      return 'TaiwanStockInfo';
    },
    us() {
      return 'USStockInfo';
    },
    default() {
      throw new Error(`Unavailable service in ${market.toUpperCase()} market.`);
    },
  };
  fn = dataset[market] ? dataset[market] : dataset['default'];

  return fn();
}
export function getStockPriceDatasetByMarket(market) {
  let fn;
  let dataset = {
    tw() {
      return 'TaiwanStockPrice';
    },
    us() {
      return 'USStockPrice';
    },
    default() {
      throw new Error(`Unavailable service in ${market.toUpperCase()} market.`);
    },
  };
  fn = dataset[market] ? dataset[market] : dataset['default'];

  return fn();
}
