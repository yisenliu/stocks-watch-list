import { Outlet } from 'react-router-dom';
import '@lib/pace';
import Container from './Container';
import Header from './Header';
import Main from './Main';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function Layout() {
  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <SpeedInsights />
    </Container>
  );
}
