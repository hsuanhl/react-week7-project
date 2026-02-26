import { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router';
import Modal from '../components/Modal';

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

const ProductList = () => {
  const FORM_TEMPLATE = {
    title: '',
    category: '',
    unit: '',
    description: '',
    content: '',
    origin_price: '',
    price: '',
    stock_status: '',
    is_enabled: false,
    imageUrl: '',
    imagesUrl: [],
  };

  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [productList, setProductList] = useState([]);
  const [formData, setFormData] = useState(FORM_TEMPLATE);
  const [modalType, setModalType] = useState('create');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // pagination
  const [pager, setPager] = useState({
    category: '',
    current_page: 1,
    has_next: true,
    has_pre: false,
    total_pages: 1,
  });

  const fetchProducts = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(
        `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${pager.current_page}`,
      );
      setProductList(response.data.products);
      setPager(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setIsFetching(false);
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
    } catch (error) {
      console.error(error?.response?.data?.message);
      navigate('/admin');
    }
  };

  const openModal = (type, product = {}) => {
    setFormData({
      ...FORM_TEMPLATE,
      ...product,
    });
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pager.current_page]);

  return (
    <>
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-3">
            <h1 className="text-lg text-slate-500">產品列表</h1>
            <button
              type="button"
              onClick={() => openModal('create', {})}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500 text-white rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] font-bold transition-all hover:bg-slate-600 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              新增產品
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm tracking-wider ">
                  <th className="border-b border-b-slate-200 px-3 py-3 font-medium">#</th>
                  <th className="border-b border-b-slate-200 px-3 py-3 font-medium">預覽</th>
                  <th className="border-b border-b-slate-200 px-3 py-3 font-medium">名稱 / 類別</th>
                  <th className="border-b border-b-slate-200 px-3 py-3 font-medium text-right">原價</th>
                  <th className="border-b border-b-slate-200 px-3 py-3 font-medium text-right">售價</th>
                  <th className="border-b border-b-slate-200 px-3 py-3 font-medium text-center">狀態</th>
                  <th className="border-b border-b-slate-200 px-3 py-3 font-medium text-center">操作</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isFetching ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        {/* <img src={loading} alt="loading" className="w-12 h-12 animate-spin" /> */}
                        <p className="text-slate-400">資料載入中...</p>
                      </div>
                    </td>
                  </tr>
                ) : productList?.length > 0 ? (
                  productList.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-2 text-slate-400 text-sm">{(pager.current_page - 1) * 10 + index + 1}</td>
                      <td className="px-3 py-2">
                        <div className="w-15 h-15 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                          <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-semibold text-slate-800">{item.title}</div>
                        <div className="text-xs text-slate-400">{item.category}</div>
                      </td>
                      <td className="px-3 py-2 text-sm text-right font-mono text-slate-400 line-through">
                        ${item.origin_price.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-sm text-right font-mono text-slate-600">
                        ${item.price.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            item.is_enabled ? 'bg-[#caeddd] text-[#3c755b]' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.is_enabled ? '已啟用' : '未啟用'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                            onClick={() => openModal('edit', item)}
                            title="編輯"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            onClick={() => openModal('delete', item)}
                            title="刪除"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-20 text-center text-slate-400">
                      目前尚無產品資料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {pager.total_pages > 1 && <Pagination pager={pager} setPager={setPager} />}
        </div>
      </div>
      {isModalOpen && (
        <Modal
          formData={formData}
          setFormData={setFormData}
          modalType={modalType}
          setIsModalOpen={setIsModalOpen}
          fetchProducts={fetchProducts}
        />
      )}
    </>
  );
};

export default ProductList;
