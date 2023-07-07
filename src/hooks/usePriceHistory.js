import useFetch from '@hooks/useFetch';

export default function usePriceHistory({ ticker = null, token, dataset, startDate, endDate }) {
  const price = useFetch(
    {
      url: '/api/stock',
      timeout: 3000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      params: {
        dataset,
        data_id: ticker,
        start_date: startDate,
        end_date: endDate,
      },
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
