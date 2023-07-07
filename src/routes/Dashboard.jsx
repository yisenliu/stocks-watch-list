import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@components/layout';

export default function Dashboard() {
  const location = useLocation().pathname;

  useEffect(() => {
    const muiLicenseKey = document.querySelector('.MuiDataGrid-main')?.lastChild;
    if (muiLicenseKey && muiLicenseKey.textContent.includes('MUI X Missing license key')) {
      muiLicenseKey.classList.add('hidden');
    }
  }, [location]);

  return <Layout />;
}
