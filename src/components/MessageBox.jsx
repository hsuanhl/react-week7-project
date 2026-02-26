import CloseIcon from '../assets/xmark-solid-full.svg';

const MessageBox = ({title, message, setBoxInfo, navigateTo}) => {
    const closeBox = () => {
    setBoxInfo(false, '',);
    navigateTo();
  };
  return (
    <>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
              className="bg-white rounded-xl flex flex-col transition-all overflow-hidden relative px-8 py-5 max-w-md w-full h-[200px]"
            >
              <div className="shrink-0">
                <img
                  className="absolute top-3 right-3 w-[30px] h-[30px] opacity-50 hover:opacity-100 cursor-pointer"
                  src={CloseIcon}
                  alt="close"
                  onClick={closeBox}
                />
                <h3 className="text-center pb-2 mb-3 text-xl border-b border-b-gray-100">
                  {title ?? ''}
                </h3>
              </div>
    
              <div className="flex-1 overflow-y-auto height-[100px] align-middle">
                  <h4 className="text-xl text-center ">{message ?? ''}</h4>
              </div>
              <div className="shrink-0 flex justify-center items-center pt-4">
                  <button
                    type="button"
                    className="w-[120px] h-[40px] cursor-pointer rounded-md bg-[#a3cadc] opacity-75 hover:opacity-100"
                    onClick={closeBox}
                  >
                    關閉
                  </button>
       
              </div>
            </div>
          </div>
    </>
  );
};

export default MessageBox;
