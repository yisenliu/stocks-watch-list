import useFetch from '@hooks/useFetch';

export default function useStockInfo(dataset, token = null) {
  const params = `?dataset=${dataset}`;
  const info = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + params)
        : '/api/stock' + params,
      timeout: 3000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      // params: {
      //   dataset,
      // },
    },
    [dataset],
  );

  if (info.error) {
    console.log(`%c${info.error.message}`, 'color: red');
  }
  if (info.data) {
    info.data = info.data.data;
  }
  return { ...info };
}
