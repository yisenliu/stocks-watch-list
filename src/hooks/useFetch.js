import fetch from '@utils/fetch';
import { useState, useEffect } from 'react';

let cacheMap = new Map();
export default function useFetch(options, dependency) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('idle');

  useEffect(() => {
    if (cacheMap.has(options.url)) {
      setData(cacheMap.get(options.url));
      setStage('fetched');

      return;
    }
    let fetchTimeoutId;
    let ignore = false;
    let retry = 0;
    function fetchData() {
      setStage('fetching');
      setError(null);
      fetch(options)
        .then(res => res.data)
        .then(data => {
          if (!ignore) {
            setData(data);
            setStage('fetched');
            setError(null);
            retry = 0;
            cacheMap.set(options.url, data);
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
    fetchData();

    return () => {
      ignore = true;
      setData(null);
      setError(null);
      setStage('idle');
      clearTimeout(fetchTimeoutId);
    };
  }, [...dependency]);

  return { data, error, stage };
}
