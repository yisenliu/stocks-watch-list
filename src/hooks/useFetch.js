import fetch, { createInstance } from '@utils/fetch';
import { useState, useEffect } from 'react';

export default function useFetch(options, dependency) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let fetchTimeoutId;
    let ignore = false;
    let retry = 0;
    function fetchData() {
      setLoading(true);
      setError(null);
      fetch(options)
        .then(res => res.data)
        .then(data => {
          if (!ignore) {
            setData(data);
            setError(null);
            retry = 0;
          }
        })
        .catch(err => {
          retry++;
          if (retry <= 2) {
            fetchTimeoutId = setTimeout(fetchData, 2000);
            if (err.message.includes('timeout')) {
              err = { ...err, message: '請求逾時 (Retry...)' };
            } else {
              err = { ...err, message: err.message + ' (Restarting...)' };
            }
          } else {
            err = { ...err, message: '重試次數已達上限，請稍候再試。' };
          }
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    fetchData();
    return () => {
      ignore = true;
      setData(null);
      setError(null);
      setLoading(false);
      clearTimeout(fetchTimeoutId);
    };
  }, [...dependency]);

  return { data, error, loading };
}

export { createInstance };
