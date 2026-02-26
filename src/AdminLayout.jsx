import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import { Outlet } from 'react-router';

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <Outlet />
      <Footer />
    </>
  );
}
export default AdminLayout;
