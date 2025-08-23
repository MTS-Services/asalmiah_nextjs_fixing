import AdminFooter from '@/app/components/admin/AdminFooter';
import AdminHeader from '../../components/admin/AdminHeader';
import './page.scss';

export const metadata = {
  title: 'Offarat',
  description:
    'Offarat All Rights Reserved. Offarat Company. Pvt. Ltd. < www.toxsl.com >',
};

export default function RootLayout({ children }) {
  return (
    <>
      <AdminHeader />
      {children}
      <AdminFooter />
    </>
  );
}
