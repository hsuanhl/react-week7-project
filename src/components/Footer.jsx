import { NavLink } from "react-router"

const Footer = () => {
  return(<>
     <footer className="bg-[#ccd4e3] border-t border-gray-100 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-xl font-light tracking-widest text-[#5d6a80] mb-4">LIVIN</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            尋找自然與現代生活的平衡，為您的空間注入安靜的力量。
          </p>
          <div className="flex gap-4 text-gray-500">
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-facebook-f"></i>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#5d6a80]">購物資訊</h3>
          <ul className="space-y-4 text-sm text-gray-500">
            <li>常見問題 FAQ</li>
            <li>運送與退換貨</li>
            <li>隱私權政策</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#5d6a80]">聯絡我們</h3>
          <ul className="space-y-4 text-sm text-gray-500">
            <li className="flex items-start gap-3">
              <i className="fa-regular fa-envelope mt-1"></i>
              <span>service@livin.design</span>
            </li>
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-phone-flip mt-1"></i>
              <span>02-2345-6789</span>
            </li>
            <li className="flex items-start gap-3 text-xs leading-relaxed">
              <i className="fa-regular fa-clock mt-1"></i>
              <span>Mon - Fri / 09:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          &copy; 2026 LIVIN SELECTION ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-4 grayscale opacity-40">
          <i className="fa-brands fa-cc-visa text-2xl"></i>
          <i className="fa-brands fa-cc-mastercard text-2xl"></i>
          <i className="fa-brands fa-cc-apple-pay text-2xl"></i>
        </div>
      </div>
    </div>
  </footer>
  </>)
}

export default Footer;