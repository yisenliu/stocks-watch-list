import concatParams from '@utils/concatParams';
import useFetch from '@hooks/useFetch';

export default function usePriceHistory({ ticker = null, token, dataset, startDate, endDate }) {
  console.log('hook: usePriceHistory');
  const params = {
    dataset,
    data_id: ticker,
    start_date: startDate,
    end_date: endDate,
  };
  const paramsStr = concatParams(token ? { ...params, token } : params);
  const price = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      timeout: 5000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    },
    [ticker, dataset],
  );

  if (price.data) {
    price.data = {
      price_history: price.data.data,
    };
  }

  return { ...price };
}
