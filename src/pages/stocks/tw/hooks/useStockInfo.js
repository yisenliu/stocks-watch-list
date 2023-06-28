import useFetch from '@hooks/useFetch';

export default function useStockInfo(token) {
  const info = useFetch(
    {
      url: '/api/stock',
      timeout: 3000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      params: {
        dataset: 'TaiwanStockInfo',
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
