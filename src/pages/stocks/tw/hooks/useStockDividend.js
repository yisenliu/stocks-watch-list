import moment from 'moment';
import useFetch from '@hooks/useFetch';

export default function useStockDividend({ ticker = null, token }) {
  const today = moment().format('YYYY-MM-DD');
  const dividend = useFetch(
    {
      url: '/api/stock',
      timeout: 3000,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        token,
      },
      params: {
        dataset: 'TaiwanStockDividendResult',
        data_id: ticker,
        start_date: `${moment().year() - 5}-01-01`,
        end_date: today,
      },
    },
    [ticker],
  );

  if (dividend.error) {
    console.log(dividend.data);
  }
  if (dividend.data) {
    const dividendOrigin = dividend.data.data;
    if (dividendOrigin.length) {
      const dividendByQuarter = dividendOrigin.reduce((acc, current) => {
        const year = moment(current.date).year();
        const quarter = 'Q' + moment(current.date).format('Q');
        const idx = acc.findIndex((item) => item.year === year);
        if (acc === [] || idx === -1) {
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
      dividend.data = {
        dividend_policy: dividendByQuarter.map((item) => ({
          ...item,
          Q1: item.Q1 ? parseFloat(item.Q1.toFixed(3)) : null,
          Q2: item.Q2 ? parseFloat(item.Q2.toFixed(3)) : null,
          Q3: item.Q3 ? parseFloat(item.Q3.toFixed(3)) : null,
          Q4: item.Q4 ? parseFloat(item.Q4.toFixed(3)) : null,
          total: item.total ? parseFloat(item.total.toFixed(3)) : null,
        })),
      };
    }
  }

  return { ...dividend };
}
