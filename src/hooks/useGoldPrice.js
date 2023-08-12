import { useEffect, useState } from 'react';
import concatParams from '@utils/concatParams';
import moment from 'moment';
import useFetch from '@hooks/useFetch';

export default function useGoldPrice(token) {
  // console.log('hook: useGoldPrice');

  const params = {
    dataset: 'GoldPrice',
    start_date: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  };
  const paramsStr = concatParams(token ? { ...params, token } : params);
  const fetchedData = useFetch(
    {
      url: process.env.GithubPages
        ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
        : '/api/stock' + paramsStr,
      timeout: 8000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    },
    [],
  );
  const [goldPrice, setGoldPrice] = useState(null);

  useEffect(() => {
    function getDailyData() {
      const originData = fetchedData.data.data;
      let prevDate = originData[0].date.split(' ')[0];
      const result = originData.reduce((acc, currentValue, currentIndex, array) => {
        const currentDate = currentValue.date.split(' ')[0];
        if (currentDate !== prevDate) {
          let daily = {
            id: prevDate,
            date: prevDate,
            close: array[currentIndex - 1].Price,
          };
          if (daily.close < 9999) {
            acc.push(daily);
          }
          prevDate = currentValue.date.split(' ')[0];
        }
        return acc;
      }, []);

      setGoldPrice(result);
      // console.log(result);
    }
    if (fetchedData.data) {
      getDailyData();
    }
  }, [fetchedData.data]);

  return { ...fetchedData, data: goldPrice };
}
