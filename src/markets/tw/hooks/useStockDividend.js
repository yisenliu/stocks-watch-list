import { useEffect, useState } from 'react';
import concatParams from '@utils/concatParams';
import moment from 'moment';
import useFetch from '@hooks/useFetch';

export default function useStockDividend({ ticker, token = null }) {
  // console.log('hook: useStockDividend');
  const today = moment().format('YYYY-MM-DD');
  const params = {
    dataset: 'TaiwanStockDividendResult',
    data_id: ticker,
    start_date: `${moment().year() - 4}-01-01`,
    end_date: today,
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
    [ticker],
  );
  const [dividend, setDividend] = useState(null);

  useEffect(() => {
    function getDividendData() {
      let result = null;
      const dividendOrigin = fetchedData.data;
      if (dividendOrigin.length) {
        const dividendByQuarter = dividendOrigin.reduce((acc, current) => {
          const year = moment(current.date).year();
          const quarter = 'Q' + moment(current.date).format('Q');
          const idx = acc.findIndex(item => item.year === year);
          if (acc.length === 0 || idx === -1) {
            const data = {
              year,
            };
            data[quarter] = current.stock_and_cache_dividend;
            data.total = current.stock_and_cache_dividend;
            acc.push(data);
          } else {
            if (acc[idx][quarter]) {
              acc[idx][quarter] += current.stock_and_cache_dividend;
            } else {
              acc[idx][quarter] = current.stock_and_cache_dividend;
            }
            acc[idx].total += current.stock_and_cache_dividend;
          }

          return acc;
        }, []);
        const dividendPolicy = dividendOrigin.reduce((acc, current) => {
          const year = current.date.slice(0, 4);
          const monthday = current.date.slice(5);
          const idx = acc.findIndex(item => item.year === year);

          if (acc.length === 0 || idx === -1) {
            const data = {
              stock_id: current.stock_id,
              year,
              dividends: [
                {
                  date: monthday,
                  value: current.stock_and_cache_dividend,
                },
              ],
            };
            acc.push(data);
          } else {
            acc[idx].dividends.push({
              date: monthday,
              value: current.stock_and_cache_dividend,
            });
          }

          return acc;
        }, []);

        result = {
          dividend_quarter: dividendByQuarter.map(item => ({
            ...item,
            Q1: item.Q1 ? parseFloat(item.Q1.toFixed(3)) : null,
            Q2: item.Q2 ? parseFloat(item.Q2.toFixed(3)) : null,
            Q3: item.Q3 ? parseFloat(item.Q3.toFixed(3)) : null,
            Q4: item.Q4 ? parseFloat(item.Q4.toFixed(3)) : null,
            total: item.total ? parseFloat(item.total.toFixed(3)) : null,
          })),
          dividend_policy: dividendPolicy,
        };
        setDividend(result);
      }
    }
    if (fetchedData.data) {
      getDividendData();
    }
  }, [fetchedData.data]);

  return { ...fetchedData, data: dividend };
}
