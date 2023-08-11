import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import getFinMindToken from '@utils/getFinMindToken';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const style = {
  margin: '4rem auto',
  width: 'min(90vw,320px)',
  bgcolor: '#fff',
  borderRadius: 1,
  p: 4,
};
export default function Login({ onSuccess }) {
  // console.log('component: Login');
  const theme = useTheme();
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ userId: null, password: null, feedback: null });
  const [token, setToken] = useState(null);
  function resetError() {
    setError({ userId: null, password: null, feedback: null });
  }

  function handleTextFieldKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateForm();
    }
  }
  async function validateForm() {
    resetError();
    if (userId.length > 0 && password.length > 0) {
      const fetchToken = await getFinMindToken(userId, password);
      if (fetchToken.status === 200) {
        setToken(fetchToken.token);
        setSuccess(true);
      } else {
        setError(error => ({ ...error, feedback: fetchToken.msg }));
      }
    } else {
      if (userId.length === 0) {
        setError(error => ({ ...error, userId: '請輸入帳號' }));
      }
      if (password.length === 0) {
        setError(error => ({ ...error, password: '請輸入密碼' }));
      }
    }
  }

  function loginByGuest() {
    setUserId('guest');
    setSuccess(true);
  }

  useEffect(() => {
    if (success) {
      onSuccess(userId, token);
    }
  }, [success]);

  return (
    <Box component="form" noValidate autoComplete="off" sx={style}>
      <Stack direction="column" spacing={2}>
        <Typography component="h2" align="center" variant="h5">
          FinMind 會員登入
        </Typography>
        {error.feedback && (
          <Typography component="p" align="center" color={theme.palette.error.main}>
            登入失敗，請檢查帳號或密碼。
          </Typography>
        )}
        <TextField
          required
          id="user_id"
          label="帳號"
          value={userId}
          error={error.userId !== null}
          helperText={error.userId}
          onChange={e => setUserId(e.target.value)}
          onKeyDown={handleTextFieldKeyDown}
        />
        <TextField
          autoComplete="true"
          required
          id="password"
          label="密碼"
          type="password"
          value={password}
          error={error.password !== null}
          helperText={error.password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleTextFieldKeyDown}
        />
        <Button variant="contained" size="large" sx={{ textTransform: 'none' }} onClick={validateForm}>
          登入
        </Button>
        <Button size="large" sx={{ textTransform: 'none', textDecoration: 'underline' }} onClick={loginByGuest}>
          以訪客身份登入
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Link to="/" className="text-blueGray-500 py-3 text-sm">
          <CottageOutlinedIcon sx={{ mr: 1 }} />
          首頁
        </Link>
        <a
          href="https://finmindtrade.com/analysis/#/account/register"
          target="_blank"
          className="text-blueGray-500 py-3 text-sm"
          rel="noreferrer"
        >
          <PersonAddAltOutlinedIcon sx={{ mr: 1 }} />
          註冊
        </a>
      </Stack>
    </Box>
  );
}
