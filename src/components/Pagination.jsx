const Pagination = ({ pager, setPager }) => {
  const switchPage = pageNum => {
    setPager(prev => ({
      ...prev,
      current_page: pageNum,
    }));
  };

  const upPage = () => {
    setPager(prev => ({
      ...prev,
      current_page: prev.current_page + 1,
    }));
  };

  const downPage = () => {
    setPager(prev => ({
      ...prev,
      current_page: prev.current_page - 1,
    }));
  };
  return (
    <>
      <ul className="flex justify-center mt-2">
        <li>
          <span
            className={`block px-3 py-2 border border-[#dde9eb] text-[rgb(69,69,69)] mx-1 rounded-[5px] cursor-pointer no-underline ${pager.has_pre ? '' : 'cursor-not-allowed pointer-events-none text-[#dddddd]'}`}
            onClick={downPage}
          >
            &laquo;
          </span>
        </li>
        {Array.from({ length: pager.total_pages }, (v, i) => i + 1).map((num, index) => {
          return (
            <li key={index}>
              <span
                className={`block px-3 py-2 border border-[#dde9eb] text-[rgb(69,69,69)] mx-1 rounded-[5px] cursor-pointer no-underline ${pager.current_page === num ? 'bg-[#dde9eb] text-[#454545]' : ''}`}
                onClick={() => switchPage(num)}
              >
                {num}
              </span>
            </li>
          );
        })}
        <li>
          <span
            className={`block px-3 py-2 border border-[#dde9eb] text-[rgb(69,69,69)] mx-1 rounded-[5px] cursor-pointer no-underline ${pager.has_next ? '' : 'cursor-not-allowed pointer-events-none text-[#dddddd]'}`}
            onClick={upPage}
          >
            &raquo;
          </span>
        </li>
      </ul>
    </>
  );
};

export default Pagination;
