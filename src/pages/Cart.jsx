import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { updateCount, initCount } from '../slices/cartSlice';
import axios from 'axios';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Cart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      const carts = response.data?.data?.carts ?? [];
      const totalQty = carts.reduce((acc, item) => {
        return acc + item.qty;
      }, 0);
      setData(response.data.data);
      dispatch(updateCount(totalQty));
    } catch (err) {
      console.error('取得購物車失敗', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;
    const data = { data: { product_id: productId, qty } };
    try {
      setIsLoading(true);
      await axios.put(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${productId}`, data);
      await getCart();
    } catch (err) {
      console.error('更新數量失敗', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async cartId => {
    try {
      setIsLoading(true);
      await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${cartId}`);
      await getCart();
    } catch (err) {
      console.error('移除商品失敗', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/carts`);
      setData({});
      dispatch(initCount());
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = price => {
    return price ? price.toLocaleString() : 0;
  };

  const countItem = (carts = []) => {
    return carts.reduce((acc, item) => {return acc + item.qty}, 0)
  }

  useEffect(() => {
    getCart();
  }, []);

  return (
    <>
      <div
        className={`min-h-screen bg-[#f9f8f6] pt-28 pb-20 transition-opacity duration-300 ${isLoading && 'opacity-50 pointer-events-none'}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-5">
            <p
              className="w-fit mb-4 text-sm text-slate-400 hover:text-[#d2b48c] transition-colors uppercase tracking-widest cursor-pointer hover:underline"
              onClick={() => {
                navigate(-1);
              }}
            >
              ← 返回前頁
            </p>
            {data.carts?.length > 0 ? (
              <p
                className="text-sm text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                onClick={() => clearCart()}
              >
                清空購物車
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="flex items-baseline justify-between mb-12">
            <h1 className="text-3xl font-light text-slate-800">您的購物車</h1>
            <span className="text-sm text-slate-400 uppercase tracking-widest"> {countItem(data.carts)} Items </span>
          </div>

          {data.carts?.length > 0 ? (
            <div className="space-y-6">
              {data.carts.map(item => {
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 flex items-center gap-6 shadow-xs border border-white hover:border-slate-100 transition-all"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                      <img src={item.product.imageUrl} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase tracking-tighter text-slate-400">
                            {item.product.category}
                          </span>
                          <h3 className="text-slate-800 font-normal">{item.product.title}</h3>
                        </div>
                        <button
                          className="text-slate-300 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          onClick={() => {
                            removeItem(item.id);
                          }}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-slate-100 rounded-full bg-slate-50 p-1">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 cursor-pointer disabled:opacity-30"
                            disabled={item.qty <= 1}
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 cursor-pointer"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>

                        <div className="text-right">
                          <p
                            className="text-xs text-slate-300 line-through mb-0.5"
                            v-if="item.product.origin_price > item.product.price"
                          >
                            ${formatPrice(item.product.origin_price * item.qty)}
                          </p>
                          <p className="text-slate-700 font-medium">${formatPrice(item.final_total)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm">
                <div className="space-y-4 mb-8">
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

                <NavLink to="/checkout">
                  <button
                    className={`w-full py-5 bg-[#5d6a80] text-white rounded-full hover:bg-[#242a36] transition-all shadow-lg font-medium tracking-widest cursor-pointer ${
                      !data.carts.length ? 'opacity-10 cursor-not-allowed pointer-events-none' : ''
                    }`}
                  >
                    前往結帳
                  </button>
                </NavLink>

                <p className="text-center mt-6">
                  <NavLink
                    to="/products"
                    className="text-sm text-slate-400 hover:text-[#d2b48c] transition-colors uppercase tracking-widest cursor-pointer"
                  >
                    ← 繼續購物
                  </NavLink>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xs">
                <i className="fa-solid fa-cart-shopping text-slate-200 text-3xl"></i>
              </div>
              <h2 className="text-xl text-slate-600 font-light mb-4">您的購物車目前是空的</h2>
              <p className="text-slate-400 text-sm mb-12">快去挑選一些讓生活更美好的物件吧</p>
              <NavLink
                to="/products"
                className="px-12 py-4 bg-[#5d6a80] text-white rounded-full hover:bg-slate-800 transition-all inline-block"
              >
                開始購物
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
