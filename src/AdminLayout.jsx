import AdminHeader from './components/AdminHeader';
import Footer from './components/Footer';
import MessageToast from './components/MessageToast';
import { Outlet } from 'react-router';

const AdminLayout = () => {
  return (
    <>
      <MessageToast />
      <AdminHeader />
      <Outlet />
      <Footer />
    </>
  );
};
export default AdminLayout;
