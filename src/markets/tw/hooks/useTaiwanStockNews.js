import concatParams from '@utils/concatParams';
import moment from 'moment';
import useFetch from '@hooks/useFetch';

export default function useTaiwanStockNews(ticker, token = null) {
  // console.log('hook: useTaiwanStockNews');
  const today = moment().format('YYYY-MM-DD');
  const params = {
    dataset: 'TaiwanStockNews',
    data_id: ticker,
    // start_date: moment().subtract(90, 'days').format('YYYY-MM-DD'),
    // end_date: today,
    start_date: today,
  };
  const paramsStr = concatParams(token ? { ...params, token } : params);
  const result = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      timeout: 30000,
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application / json' },
    },
    [ticker],
  );

  if (result.data) {
    const newsData = [...result.data];
    result.data = newsData.reverse();
  }
  return result;
}
