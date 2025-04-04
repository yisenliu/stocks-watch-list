import concatParams from '@utils/concatParams';
import moment from 'moment';
import useFetch from '@hooks/useFetch';

export default function useTreasuryBondsYield(data_id = null) {
  const params = {
    dataset: 'GovernmentBondsYield',
    data_id,
    start_date: moment().subtract(5, 'year').format('YYYY-MM-DD'),
  };
  const paramsStr = concatParams(params);
  const result = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      timeout: 8000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    },
    [data_id],
  );

  return result;
}
