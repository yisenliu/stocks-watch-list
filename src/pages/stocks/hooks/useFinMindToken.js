import fetch from '@utils/fetch';
import { useState, useEffect } from 'react';

export default function useFinMindToken() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetch({
      method: 'post',
      url: '/api/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        user_id: import.meta.env.VITE_FinMind_User_Id,
        password: import.meta.env.VITE_FinMind_Password,
      },
    }).then(res => {
      setToken(res.data.token);
    });
  }, []);

  return token;
}
