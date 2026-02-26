import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateCount } from '../slices/cartSlice';
import Card from '../components/Card';
import Popup from '../components/Popup';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Home = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      const carts = response.data?.data?.carts ?? [];
      const totalQty = carts.reduce((acc, item) => {
        return acc + item.qty;
      }, 0);
      dispatch(updateCount(totalQty));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products`);
        setProducts(response.data.products.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    fetchCart();
  }, []);

  return (
    <>
      <header className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 zoom-animation">
          <img
            src="https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?q=80&w=2106&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="w-full h-full object-cover brightness-90"
            alt="Hero background"
          />
        </div>
        <div className="relative text-center text-gray-100 px-4">
          <span className="uppercase tracking-[0.3em] text-sm mb-6 block">New Collection 2026</span>
          <h1 className="text-4xl md:text-6xl font-extralight mb-16 tracking-tight ">把生活，過成喜歡的樣子</h1>
          <NavLink
            to="/products"
            className="inline-block px-10 py-4 border border-gray-200 text-gray-100 hover:bg-[#5b6c87] hover:border-[#5b6c87] hover:text-white transition-all duration-200 rounded-full cursor-pointer"
          >
            開始探索
          </NavLink>
        </div>
      </header>

      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-3xl font-light text-[#5d6a80]">精選單品</h2>
          <NavLink to="/products" className="text-[#7c869c] hover:underline transition-all">
            查看全部 →
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map(product => {
            return <Card product={product} key={product.id} />;
          })}
        </div>
      </section>
    </>
  );
};

export default Home;
