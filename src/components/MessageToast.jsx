import { useSelector } from "react-redux";

const MessageToast = () => {
  const messages = useSelector((state) => state.message); 
  return (

    <div className="fixed top-24 right-6 p-3 z-[999]">
      {messages.length ? messages.map((message) => (
      <div
        key={message.id}
        className={`px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 transition-all mb-1 ${
          message.isSuccess ? 'bg-white/90 border-[#5d6a80] text-[#5d6a80]' : 'bg-red-50 border-red-200 text-red-600'
        }`}
      >
        {message.isSuccess ? <i className="fa-solid fa-check-circle"></i> : <i className="fa-solid fa-circle-exclamation"></i>}

        <span className="tracking-widest text-sm font-light">{message.text}</span>
      </div>
      )) : <></>}
    </div>
  );
}


export default MessageToast;