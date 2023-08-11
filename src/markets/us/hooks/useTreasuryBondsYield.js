import concatParams from '@utils/concatParams';
import moment from 'moment';
import useFetch from '@hooks/useFetch';

export default function useTreasuryBondsYield(data_id = null, token) {
  const params = {
    dataset: 'GovernmentBondsYield',
    data_id,
    start_date: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  };
  const paramsStr = concatParams(token ? { ...params, token } : params);
  const result = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      timeout: 3000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    },
    [data_id],
  );

  if (result.data) {
    result.data = result.data.data;
  }

  return { ...result };
}
