import useFetch from '@hooks/useFetch';

export default function useStockInfo(dataset, token = null) {
  // console.log('hook: useStockInfo');
  const paramsStr = `?dataset=${dataset}`;
  const result = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      timeout: 5000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
    },
    [dataset],
  );

  if (result.data) {
    result.data = result.data.data;
  }

  return result;
}
