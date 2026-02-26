import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const submitForm = async data => {
    try {
      const response = await axios.post(`${VITE_API_BASE}/admin/signin`, data);
      const { token, expired } = response.data;
      document.cookie = `loginToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      navigate('/admin/productList');
    } catch (error) {
      console.error(error?.response?.data);
    }
  };

  const checkStatus = async () => {
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      if (!token) {
        return;
      }
      axios.defaults.headers.common['Authorization'] = token;
      await axios.post(`${VITE_API_BASE}/api/user/check`);
      navigate('/admin/productList');
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#f9f8f6] pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-center text-4xl font-light text-slate-700 tracking-tight pb-10">登入</h1>

          <form onSubmit={handleSubmit(submitForm)} className="w-fit border-red mx-auto">
            <div className="flex flex-col gap-1 mb-5">
              <label htmlFor="username" className="text-gray-500">
                Email
              </label>
              <input
                id="username"
                className="outline-transparent border border-gray-400 rounded-sm w-64 h-8 px-2 focus:outline-gray-500"
                {...register('username', {
                  required: 'email必填',
                  pattern: { value: /^\S+@\S+$/i, message: 'email格式錯誤' },
                })}
                style={{
                  border: errors.username && '1px solid #b52616',
                }}
              />
              <p className="text-sm text-[#b52616]">{errors.username && errors.username.message}</p>
            </div>
            <div className="flex flex-col gap-1 mb-5">
              <label htmlFor="password" className="text-gray-500">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="outline-transparent border border-gray-400 rounded-sm w-64 h-8 px-2 focus:outline-gray-500"
                {...register('password', {
                  required: '密碼必填',
                })}
                style={{
                  border: errors.password && '1px solid #b52616',
                }}
              />
              <p className="text-sm text-[#b52616]"> {errors.password && errors.password.message}</p>
            </div>
            <button
              type="submit"
              className="w-full h-10 mt-2 border border-gray-300 bg-gray-200 rounded-sm text-gray-500 hover:bg-gray-600 hover:text-white cursor-pointer"
            >
              送出
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
