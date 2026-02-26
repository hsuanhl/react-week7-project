import { useState } from 'react';
import axios from 'axios';
import CloseIcon from '../assets/xmark-solid-full.svg';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const MAX_IMAGES = 5;

const MODAL_TITLE = {
  create: '新增產品',
  edit: '修改產品',
  delete: '刪除產品',
};

const Modal = ({ modalType, formData, setFormData, fetchProducts, setIsModalOpen }) => {
  const [submitMessage, setSubmitMessage] = useState('');

  // API相關
  const handleCreate = async () => {
    try {
      const param = {
        data: {
          ...formData,
          origin_price: Number(formData.origin_price),
          price: Number(formData.price),
          is_enabled: formData.is_enabled ? 1 : 0,
          imagesUrl: formData.imagesUrl,
        },
      };
      await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, param);
      closeModal();
      fetchProducts();
    } catch (error) {
      const message = error?.response?.data?.message.join(',');
      setSubmitMessage(message);
    }
  };

  const handleEdit = async () => {
    try {
      const id = formData.id;
      const param = {
        data: {
          ...formData,
          origin_price: Number(formData.origin_price),
          price: Number(formData.price),
          is_enabled: formData.is_enabled ? 1 : 0,
          imagesUrl: formData.imagesUrl,
        },
      };
      await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${id}`, param);
      closeModal();
      fetchProducts();
    } catch (error) {
      const message = error?.response?.data?.message.join(',');
      setSubmitMessage(message);
    }
  };

  const handleDelete = async () => {
    try {
      const id = formData.id;
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      closeModal();
      fetchProducts();
    } catch (error) {
      const message = error?.response?.data?.message.join(',');
      setSubmitMessage(message);
    }
  };


  const handleImageChange = (index, value) => {
    setFormData(prev => {
      const newImages = [...prev.imagesUrl];
      newImages[index] = value;
      return {
        ...prev,
        imagesUrl: newImages,
      };
    });
  };

  const handleFormChange = e => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file-to-upload', file);
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);
      setFormData(prev => {
        return {
          ...prev,
          imageUrl: response.data.imageUrl,
        };
      });
      e.target.value = '';
    } catch (error) {
      const message = error?.response?.data?.message;
      setSubmitMessage(message);
    }
  };

  const addPic = () => {
    setFormData(prev => {
      if (prev.imagesUrl.length >= MAX_IMAGES) return prev;
      return {
        ...prev,
        imagesUrl: [...prev.imagesUrl, ''],
      };
    });
  };

  const deletePic = index => {
    setFormData(prev => {
      return {
        ...prev,
        imagesUrl: prev.imagesUrl.filter((_, i) => {
          return i !== index;
        }),
      };
    });
  };

    const handleConfirm = () => {
    const actions = {
      create: handleCreate,
      edit: handleEdit,
      delete: handleDelete,
    };
    actions[modalType]?.();
  };

  const closeModal = () => {
    setSubmitMessage('');
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
          className={`bg-white rounded-xl flex flex-col transition-all overflow-hidden relative px-8 py-5 ${
            modalType === 'delete' ? 'max-w-md w-full' : 'max-w-5xl w-full'
          } max-h-[90vh]`}
        >
          <div className="shrink-0">
            <img
              className="absolute top-3 right-3 w-[30px] h-[30px] opacity-50 hover:opacity-100 cursor-pointer"
              src={CloseIcon}
              alt="close"
              onClick={closeModal}
            />
            <h3 className="text-center pb-2 mb-3 text-xl border-b border-b-gray-100">
              {MODAL_TITLE[modalType] ?? '新增產品'}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto flex gap-8" style={modalType === 'delete' ? { height: '100px' } : {}}>
            {modalType === 'delete' ? (
              <div>確認要刪除此產品？</div>
            ) : (
              <>
                <div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="title">
                      標題
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="h-[25px] w-[300px] border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.title}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="description">
                      描述
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      cols="35"
                      className="border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.description}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="content">
                      說明
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows="4"
                      cols="35"
                      className="border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.content}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="category">
                      分類
                    </label>
                    <input
                      type="text"
                      name="category"
                      id="category"
                      className="h-[25px] border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.category}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="unit">
                      單位
                    </label>
                    <input
                      type="text"
                      name="unit"
                      id="unit"
                      className="h-[25px] border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.unit}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="origin_price">
                      原價
                    </label>
                    <input
                      type="number"
                      name="origin_price"
                      id="origin_price"
                      min="0"
                      className="h-[25px] border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.origin_price}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="price">
                      售價
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      className="h-[25px] border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.price}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="stock_status">
                      庫存
                    </label>
                    <select
                      name="stock_status"
                      id="stock_status"
                      className="h-[25px] w-[180px] border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.stock_status}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    >
                      <option value="">--請選擇--</option>
                      <option value="in_stock">現貨供應</option>
                      <option value="low_stock">庫存緊張</option>
                      <option value="out_of_stock">暫時缺貨</option>
                      <option value="pre_order">預購商品</option>
                    </select>
                  </div>

                  <div className="flex gap-3 items-center mb-2">
                    <p className="text-gray-500">啟用</p>
                    <div>
                      <input
                        type="checkbox"
                        id="is_enabled"
                        name="is_enabled"
                        checked={formData.is_enabled}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            is_enabled: e.target.checked,
                          })
                        }
                      />
                      <label htmlFor="is_enabled">是</label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="uploadimg">
                      上傳主圖
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="uploadimg"
                        accept=".png,.jpeg,.jpg"
                        className="hidden"
                        onChange={e => handleFileChange(e)}
                      />
                      <label
                        htmlFor="uploadimg"
                        className="flex items-center gap-2 px-1 py-0 bg-white border border-slate-300 rounded-lg cursor-pointer 
                 text-sm font-semibold text-slate-700 shadow-sm transition-all
                 hover:bg-slate-50 hover:border-slate-400 active:scale-95"
                      >
                        選擇檔案
                      </label>
                      <span className="text-xs text-slate-400 truncate max-w-[150px]">未選擇檔案</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500 text-sm">或 </label>
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <label className="text-gray-500" htmlFor="imageUrl">
                      主圖網址
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      id="imageUrl"
                      className="h-[25px] w-[380px] border border-gray-300 rounded-sm px-1 focus:outline-none"
                      value={formData.imageUrl}
                      onChange={e => {
                        handleFormChange(e);
                      }}
                    />
                    {formData.imageUrl.trim() !== '' && (
                      <img className="h-[65px]" src={formData.imageUrl} alt="main-pic" />
                    )}
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <p className="text-gray-500">其他圖片</p>
                    <button
                      type="button"
                      className="px-2 py-0 bg-white border border-slate-300 rounded-lg cursor-pointer text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-95"
                      disabled={formData.imagesUrl.length >= 5}
                      onClick={addPic}
                    >
                      增加
                    </button>
                    <p>(最多5張)</p>
                  </div>
                  {formData.imagesUrl &&
                    formData.imagesUrl.length > 0 &&
                    formData.imagesUrl.map((img, index) => {
                      return (
                        <div key={index} className="flex gap-3 items-center mb-2">
                          <label />
                          <input
                            type="text"
                            value={img}
                            className="h-[25px] w-[370px] border border-gray-300 rounded-sm px-1 focus:outline-none"
                            onChange={e => {
                              handleImageChange(index, e.target.value);
                            }}
                          />
                          {img.trim() !== '' && <img className="h-[65px]" src={img} alt="preview" />}
                          <button
                            type="button"
                            className="px-2 py-0 bg-white border border-slate-300 rounded-lg cursor-pointer text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-95"
                            onClick={() => deletePic(index)}
                          >
                            刪除
                          </button>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
          <div className="shrink-0 flex justify-between items-center pt-4">
            <p style={{ color: 'rgb(171, 15, 15)', fontSize: '14px' }}>
              {submitMessage !== '' ? `提示：${submitMessage}` : ''}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="w-[90px] h-[40px] cursor-pointer rounded-md bg-[#ebebeb] opacity-75 hover:opacity-100"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                type="button"
                className="w-[90px] h-[40px] cursor-pointer rounded-md bg-[#a3cadc] opacity-75 hover:opacity-100"
                onClick={handleConfirm}
              >
                {modalType === 'delete' ? '確認' : '送出'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
