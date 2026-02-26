import { NavLink } from 'react-router';
import { useDispatch } from 'react-redux';
import { addCount } from '../slices/cartSlice';
import { createAsyncMessage } from '../slices/messageSlice';
import axios from 'axios';
import { useState } from 'react';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Card = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const addToCart = async (productId, qty = 1) => {
    const data = { data: { product_id: productId, qty } };
    try {
      setIsLoading(true);
      await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, data);
      dispatch(addCount(1));
      dispatch(
        createAsyncMessage({
          message: `成功加入 ${qty} 件商品！`,
          success: true,
        }),
      );
    } catch (err) {
      console.error('[AddToCart Error]', err);
      dispatch(
        createAsyncMessage({
          message: '無法加入購物車，請稍後再試',
          success: false,
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`group bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl transition-all duration-500 ${isLoading && 'opacity-50 pointer-events-none'} `}
      >
        <NavLink to={`/product/${product.id}`} className="block">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-6">
            <img
              src={product.imageUrl}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="px-2">
            <h3 className="text-lg text-slate-800 font-normal mb-1">{product.title}</h3>
            <p className="text-slate-500 font-medium">${product.price.toLocaleString()}</p>
          </div>
        </NavLink>

        <button
          type="button"
          className="mt-4 w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-[#5d6a80] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => addToCart(product.id)}
        >
          <i className="fa-solid fa-cart-plus text-xs"></i>
          <span className="text-sm">加入購物車</span>
        </button>
      </div>
    </>
  );
};

export default Card;
