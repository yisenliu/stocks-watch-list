import { Outlet } from 'react-router-dom';
import '@lib/pace';
import Container from './Container';
import Header from './Header';
import Main from './Main';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Layout() {
  return (
    <Container>
      <SpeedInsights />
      <Header />
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}
