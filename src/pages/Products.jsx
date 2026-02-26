import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';

import { ThreeDots } from 'react-loader-spinner';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    category: '',
    current_page: 1,
    has_next: true,
    has_pre: false,
    total_pages: 1,
  });

  const nextPage = () => {
    if (isLoading || !pagination.has_next) return;
    setPagination(prev => ({
      ...prev,
      current_page: prev.current_page + 1,
    }));
  };

  const fetchData = async page => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products?page=${page}`);
      setProducts(prev => [...prev, ...response.data.products]);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current_page);
  }, [pagination.current_page]);

  return (
    <>
      <div className="min-h-screen bg-[#f9f8f6] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <header className="text-center mb-16">
            <h1 className="text-4xl font-light text-slate-700 tracking-tight">所有產品</h1>
            <p className="text-slate-400 mt-4 font-light">從質感出發，為您精心挑選的設計</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map(product => {
              return <Card key={product.id} product={product} />;
            })}
          </div>

          <div className="mt-20 flex flex-col items-center">
            {pagination.has_next ? (
              <button
                onClick={nextPage}
                disabled={isLoading}
                className="group relative px-12 py-4 bg-white border border-[#5d6a80] text-[#5d6a80] rounded-full overflow-hidden transition-all hover:text-white hover:bg-[#5d6a80] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                      正在為您佈置展間
                      <ThreeDots
                        visible={true}
                        height="20"
                        width="20"
                        color="#668fb385"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    </span>
                  </>
                ) : (
                  <span className="relative z-10 flex items-center gap-2">載入更多商品</span>
                )}
              </button>
            ) : (
              <div className="text-slate-300 flex items-center gap-4">
                <div className="h-[1px] w-12 bg-slate-200"></div>
                <span className="text-sm tracking-widest uppercase">End of Collection</span>
                <div className="h-[1px] w-12 bg-slate-200"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
