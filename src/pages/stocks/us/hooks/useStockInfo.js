import useFetch from '@hooks/useFetch';

export default function useStockInfo(token) {
  const info = useFetch(
    {
      url: '/api/stock',
      timeout: 5000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      params: {
        dataset: 'USStockInfo',
      },
    },
    [],
  );

  if (info.error) {
    console.log({ StockInfoError: info.data });
  }
  if (info.data) {
    info.data = info.data.data;
  }
  return { ...info };
}
