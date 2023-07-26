import useFetch from '@hooks/useFetch';

export default function useStockInfo(token, dataset) {
  console.log({ token });
  const info = useFetch(
    {
      url: process.env.isGithubPages
        ? process.env.corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/login')
        : '/api/stock',
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
    console.log(`%c${info.error.message}`, 'color: red');
  }
  if (info.data) {
    info.data = info.data.data;
  }
  return { ...info };
}
