const Popup = ({ type, message }) => {
  const isSuccess = type === 'success';

  return (
    <>
      <div
        className={`fixed top-24 right-6 z-[999] px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 transition-all ${
          isSuccess ? 'bg-white/90 border-[#5d6a80] text-[#5d6a80]' : 'bg-red-50 border-red-200 text-red-600'
        }`}
      >
        {isSuccess ? <i className="fa-solid fa-check-circle"></i> : <i className="fa-solid fa-circle-exclamation"></i>}

        <span className="tracking-widest text-sm font-light">{message}</span>
      </div>
    </>
  );
};

export default Popup;
