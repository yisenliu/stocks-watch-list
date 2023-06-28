import useFetch from '@hooks/useFetch';

export default function useStockInfo(token, dataset) {
  const info = useFetch(
    {
      url: '/api/stock',
      timeout: 3000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      params: {
        dataset,
      },
    },
    [dataset],
  );

  if (info.error) {
    console.log({ StockInfoError: info.data });
  }
  if (info.data) {
    info.data = info.data.data;
  }
  return { ...info };
}
