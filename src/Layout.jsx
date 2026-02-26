import Header from './components/Header';
import Footer from './components/Footer';
import MessageToast from './components/MessageToast';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <>
      <MessageToast />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default Layout;
