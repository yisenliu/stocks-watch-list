import fetch from '@utils/fetch';
import { useState, useEffect } from 'react';

export default function useFinMindToken() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    fetch({
      method: 'post',
      url: process.env.isGithubPages ? 'https://api.finmindtrade.com/api/v4/login' : '/api/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        user_id: process.env.isGithubPages ? process.env.FINMIND_USER_ID : import.meta.env.VITE_FinMind_User_Id,
        password: process.env.isGithubPages ? process.env.FINMIND_PASSWORD : import.meta.env.VITE_FinMind_Password,
      },
    }).then(res => {
      setToken(res.data.token);
    });
  }, []);

  return token;
}
