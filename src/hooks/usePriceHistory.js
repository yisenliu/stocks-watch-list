import concatParams from '@utils/concatParams';
import moment from 'moment';
import useFetch from '@hooks/useFetch';

export default function usePriceHistory({
  dataset,
  data_id = null,
  token = null,
  start_date = moment().subtract(5, 'year').format('YYYY-MM-DD'),
  end_date = moment().format('YYYY-MM-DD'),
}) {
  // console.log('hook: usePriceHistory');
  const params = {
    dataset,
    data_id,
    token,
    start_date,
    end_date,
  };
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      delete params[key];
    }
  }
  const paramsStr = concatParams(params);
  const result = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      timeout: 8000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    },
    [data_id, dataset],
  );

  return result;
}
