import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router';
import { useDispatch } from 'react-redux';
import { addCount } from '../slices/cartSlice';
import { createAsyncMessage } from '../slices/messageSlice';
import axios from 'axios';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Product = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { id } = params;

  const [product, setProduct] = useState([]);
  const [mainPic, setMainPic] = useState(null);

  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setQty(prev => prev + 1);
  };

  const handleMinus = () => {
    setQty(prev => {
      return prev > 1 ? prev - 1 : 1;
    });
  };

  const addToCart = async (productId, qty) => {
    const data = { data: { product_id: productId, qty } };
    try {
      await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, data);
      dispatch(addCount(qty));
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
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/product/${id}`);
        setProduct(response.data.product);
        setMainPic(response.data.product.imageUrl);
      } catch (error) {
        console.error('抓取失敗', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#f9f8f6] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <NavLink to="/products" className="text-[#7c869c] hover:underline transition-all">
          ← 返回產品
        </NavLink>
      </div>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center text-slate-400 tracking-widest animate-pulse uppercase">
          loading
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-sm">
              <img src={mainPic} className="w-full h-full object-cover transition-all duration-500" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              <div
                className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${mainPic === product.imageUrl ? 'border-[#5d6a80]' : 'border-transparent opacity-50'}`}
                onClick={() => setMainPic(product.imageUrl)}
              >
                <img src={product.imageUrl} className="w-full h-full object-cover" />
              </div>
              {product.imagesUrl &&
                product.imagesUrl.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${mainPic === img ? 'border-[#5d6a80]' : 'border-transparent opacity-50'}`}
                      onClick={() => setMainPic(img)}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="flex items-center gap-2 text-xs text-slate-400 mb-3 uppercase tracking-widest">
              {product.category}
            </p>

            <h1 className="text-3xl font-light text-slate-800 mb-4">{product.title}</h1>
            <p className="text-slate-500 leading-relaxed mb-8 font-light italic">{product.description}</p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl font-medium text-[#5d6a80]">${product.price?.toLocaleString()}</span>
              <span className="text-lg text-slate-300 line-through">${product.origin_price?.toLocaleString()}</span>
            </div>

            <div className="w-full h-[1px] bg-slate-200 mb-8"></div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">選購數量 ({product.unit})</span>
                <div className="flex items-center border border-slate-200 rounded-full px-4 py-2 bg-white">
                  <button onClick={handleMinus} className="w-8 text-slate-400 hover:text-slate-700 cursor-pointer">
                    -
                  </button>
                  <input type="text" value={qty} className="w-12 text-center outline-none bg-transparent" readOnly />
                  <button onClick={handleAdd} className="w-8 text-slate-400 hover:text-slate-700 cursor-pointer">
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => addToCart(product.id, qty)}
                className="w-full py-5 bg-[#5d6a80] text-white rounded-full hover:bg-[#242a36] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
              >
                加入購物車
              </button>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 tracking-widest uppercase">商品詳情</h3>
              <p className="text-slate-500 text-sm leading-loose whitespace-pre-line">{product.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
