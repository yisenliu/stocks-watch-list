import fetch from '@utils/fetch';

export default function getFinMindToken(user_id, password) {
  return fetch({
    method: 'post',
    url: process.env.isGithubPages ? 'https://api.finmindtrade.com/api/v4/login' : '/api/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: {
      user_id,
      password,
    },
  })
    .then(res => res.data)
    .catch(error => error.response.data);
}
