import { db, saveData } from '@lib/myDB';
import { useState, useEffect } from 'react';
import fetch from '@utils/fetch';
import concatParams from '@utils/concatParams';

export default function useStockInfo(dataset, token = null, storeName) {
  // console.log('hook: useStockInfo');
  const paramsStr = concatParams(token ? { dataset, token } : { dataset });
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('idle');
  const params = {
    url: process.env.GithubPages
      ? corsProxy + encodeURIComponent('https://api.finmindtrade.com/api/v4/data' + paramsStr)
      : '/api/stock' + paramsStr,
    timeout: 8000,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  };

  useEffect(() => {
    let fetchTimeoutId;
    let ignore = false;
    let retry = 0;
    async function fetchData() {
      const storeData = await db.getAll(storeName);

      if (storeData.length) {
        // get data from indexedDB
        setData(storeData);
        setStage('fetched');
      } else {
        // fetch data
        setStage('fetching');
        setError(null);
        fetch(params)
          .then(res => res.data.data)
          .then(data => {
            if (!ignore) {
              saveData(data, storeName).then(() => {
                setData(data);
                setStage('fetched');
                setError(null);
                retry = 0;
              });
            }
          })
          .catch(err => {
            retry++;
            if (retry <= 2) {
              fetchTimeoutId = setTimeout(fetchData, 1000);
              if (err.message.includes('timeout')) {
                err = { ...err, message: '請求逾時 (Retry...)' };
              } else {
                err = { ...err, message: err.message + ' (Restarting...)' };
              }
            } else {
              err = { ...err, message: '重試次數已達上限，請稍候再試。' };
            }
            setError(err);
            setStage('idle');
          });
      }
    }
    fetchData();

    return () => {
      ignore = true;
      setData(null);
      setError(null);
      setStage('idle');
      clearTimeout(fetchTimeoutId);
    };
  }, [dataset]);

  return { data, error, stage };
}
