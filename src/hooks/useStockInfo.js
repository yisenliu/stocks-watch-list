import useFetch from '@hooks/useFetch';

export default function useStockInfo(dataset, token = null) {
  const stockInfo = sessionStorage.getItem(dataset);
  const params = `?dataset=${dataset}`;
  const result = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + params)
        : '/api/stock' + params,
      timeout: 5000,
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

  if (stockInfo) {
    return {
      data: JSON.parse(stockInfo),
      error: null,
      loading: false,
    };
  } else {
    if (result.error) {
      console.log(`%c${result.error.message}`, 'color: red');
    }
    if (result.data) {
      result.data = result.data.data;
      sessionStorage.setItem(dataset, JSON.stringify(result.data));
    }
    return { ...result };
  }
}
