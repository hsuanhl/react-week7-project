import { NavLink, useNavigate } from 'react-router';
import axios from 'axios';

const { VITE_API_BASE } = import.meta.env;

const AdminHeader = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post(`${VITE_API_BASE}/logout`);
      document.cookie = 'loginToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/admin');
    } catch (error) {
      console.error('登出錯誤', error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full h-[70px] bg-white/70 backdrop-blur-md border-b border-black/5 flex items-end gap-8 pb-4 px-6 md:px-12 z-50">
        <h1 className="text-xl font-light tracking-widest text-[#5d6a80]">LIVIN後台</h1>
        <div className="grow flex gap-8 justify-end items-end ">
          <NavLink to="/" className="hover:opacity-80 transition-opacity">
            <div className="text-md font-light tracking-widest text-[#5d6a80]">回到前台</div>
          </NavLink>
          <div className="hover:opacity-80 transition-opacity cursor-pointer" onClick={logout}>
            <div className="text-md font-light tracking-widest text-[#5d6a80]">登出</div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminHeader;
