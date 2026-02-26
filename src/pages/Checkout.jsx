import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import axios from 'axios';
import MessageBox from '../components/MessageBox';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [boxInfo, setBoxInfo] = useState({ show: false, title: '', message: '' });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onTouched',
  });

  const triggerBox = (title, message) => {
    setBoxInfo({ show: true, title, message });
  };

  const navigateTo = ()=> {
    navigate('/')
  }

  const submitForm = async data => {
    const param = { data: data };
    try {
      await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/order`, param);
      triggerBox('成功送出', '訂單明細已寄出，點擊關閉回到首頁！');
    } catch (error) {
      console.error(error?.response?.data);
      triggerBox('送出失敗', '抱歉，送出訂單失敗，請稍後再試');
    }
  };

  const getCart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      setData(response.data.data);
    } catch (err) {
      console.error('取得購物車失敗', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = price => {
    return price ? price.toLocaleString() : 0;
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      <div
        className={`min-h-screen bg-[#f9f8f6] pt-28 pb-20 transition-opacity duration-300 ${isLoading && 'opacity-50 pointer-events-none'}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <p
            className="w-fit mb-4 text-sm text-slate-400 hover:text-[#d2b48c] transition-colors uppercase tracking-widest cursor-pointer hover:underline"
            onClick={() => {
              navigate(-1);
            }}
          >
            ← 返回前頁
          </p>
          <div className="flex items-baseline justify-between mb-12">
            <h1 className="text-3xl font-light text-slate-800">付款表單</h1>
            <span className="text-sm text-slate-400 uppercase tracking-widest"> {data.carts?.length || 0} Items </span>
          </div>

          {data.carts?.length > 0 ? (
            <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm">
              {data.carts.map(item => {
                return (
                  <div key={item.id} className="flex gap-5 mb-3">
                    <div className="w-15 h-15 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                      <img src={item.product.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div>
                        <span className="text-[10px] tracking-tighter text-slate-400">{item.product.category}</span>
                        <h3 className="text-slate-800 font-normal">{item.product.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-transparent">0</span>
                        <p className="text-slate-700 font-medium">{item.qty} x</p>
                      </div>
                    </div>
                    <div className="flex-1 flex gap-8">
                      <div className="flex-1 flex justify-between">
                        <div className="text-left">
                          <span className="text-[10px] text-slate-300 line-through">
                            ${formatPrice(item.product.origin_price)}
                          </span>
                          <p className="text-slate-700 font-medium">${formatPrice(item.product.price)}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-transparent">0</span>
                          <p className="text-slate-700 font-medium">${formatPrice(item.final_total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>小計 Subtotal</span>
                  <span>${formatPrice(data.final_total)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>運費 Shipping</span>
                  {data.final_total > 2000 ? <span className="text-amber-700">免運費</span> : <span>$150</span>}
                </div>
                <div className="h-[1px] bg-slate-100"></div>
                <div className="flex justify-between text-xl text-slate-800">
                  <span className="font-light">總計 Total</span>
                  <span className="font-medium text-[#5d6a80]">
                    ${formatPrice(data.final_total > 2000 ? data.final_total : data.final_total + 150)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="mb-5 pb-2 border-b border-b-gray-100 font-light text-xl text-gray-500 text-center">
              客戶資訊
            </h2>
            <form onSubmit={handleSubmit(submitForm)} className="w-full border-red mx-auto">
              <div className="flex flex-col gap-1 w-md mx-auto mb-3 ">
                <div className="flex items-end justify-between">
                  <label htmlFor="name" className="text-gray-500">
                    姓名
                  </label>
                  <p className="shrink-0 text-sm text-[#b52616]">{errors?.user?.name && errors.user?.name.message}</p>
                </div>
                <input
                  id="name"
                  className="outline-transparent border border-gray-400 rounded-sm h-8 px-2 focus:outline-gray-500"
                  {...register('user.name', {
                    required: '*必填',
                  })}
                  style={{
                    border: errors?.user?.name && '1px solid #b52616',
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 w-md mx-auto mb-3 ">
                <div className="flex items-end justify-between">
                  <label htmlFor="email" className="text-gray-500">
                    Email
                  </label>
                  <p className="shrink-0 text-sm text-[#b52616]">
                    {errors?.user?.email && errors?.user?.email.message}
                  </p>
                </div>
                <input
                  id="email"
                  type="email"
                  className="outline-transparent border border-gray-400 rounded-sm h-8 px-2 focus:outline-gray-500"
                  {...register('user.email', {
                    required: '*必填',
                    pattern: { value: /^\S+@\S+$/i, message: '格式錯誤' },
                  })}
                  style={{
                    border: errors?.user?.email && '1px solid #b52616',
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 w-md mx-auto mb-3 ">
                <div className="flex items-end justify-between">
                  <label htmlFor="tel" className="text-gray-500">
                    電話
                  </label>
                  <p className="shrink-0 text-sm text-[#b52616]"> {errors?.user?.tel && errors?.user?.tel.message}</p>
                </div>
                <input
                  id="tel"
                  type="tel"
                  className="outline-transparent border border-gray-400 rounded-sm h-8 px-2 focus:outline-gray-500"
                  {...register('user.tel', {
                    required: '*必填',
                    minLength: { value: 8, message: '至少8碼' },
                    pattern: { value: /^\d+$/, message: '只能輸入數字' },
                  })}
                  style={{
                    border: errors?.user?.tel && '1px solid #b52616',
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 w-md mx-auto mb-3 ">
                <div className="flex items-end justify-between">
                  <label htmlFor="address" className="text-gray-500">
                    地址
                  </label>
                  <p className="shrink-0 text-sm text-[#b52616]">
                    {' '}
                    {errors?.user?.address && errors?.user?.address.message}
                  </p>
                </div>
                <input
                  id="address"
                  type="text"
                  className="outline-transparent border border-gray-400 rounded-sm h-8 px-2 focus:outline-gray-500"
                  {...register('user.address', {
                    required: '*必填',
                  })}
                  style={{
                    border: errors?.user?.address && '1px solid #b52616',
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 w-md mx-auto mb-10 ">
                <div className="flex items-center justify-between">
                  <label htmlFor="message" className="text-gray-500">
                    留言
                  </label>
                </div>
                <textarea
                  id="message"
                  row="2"
                  className="outline-transparent border border-gray-400 rounded-sm px-2 focus:outline-gray-500"
                  {...register('message')}
                />
              </div>
              <button
                className="w-full py-5 bg-[#5d6a80] text-white rounded-full hover:bg-[#242a36] transition-all shadow-lg font-medium tracking-widest cursor-pointer disabled:cursor-not-allowed disabled:pointer-event-none disabled:hover:bg-[#5d6a80]"
                disabled={!isValid}
              >
                前往付款
              </button>
              <p className="text-center mt-6">
                <NavLink
                  to="/cart"
                  className="text-sm text-slate-400 hover:text-[#d2b48c] transition-colors uppercase tracking-widest cursor-pointer"
                >
                  ← 返回購物車
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
      {boxInfo.show && <MessageBox title={boxInfo.title} message={boxInfo.message} setBoxInfo={setBoxInfo} navigateTo={navigateTo}/>}
    </>
  );
};

export default Checkout;