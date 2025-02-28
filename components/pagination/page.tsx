import React from "react";

const Pagination = ({ totalPages, page, handlePageChange }: any) => {
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`hover:bg-gray-400 dark:hover:bg-gray-800 rounded-md w-8 h-8 ${page === i ? "bg-indigo-600 text-slate-200" : "dark:text-slate-200 text-zinc-800"
              }`}
            onClick={() => handlePageChange(i)}
          >
            <span className="text-base font-semibold">{i}</span>
          </button>
        );
      }
    } else {
      const startPage = Math.max(1, page - 2);
      const endPage = Math.min(totalPages, startPage + 4);

      if (startPage > 1) {
        pages.push(
          <button
            key={1}
            className={`hover:bg-gray-400 dark:hover:bg-gray-800 rounded-md w-8 h-8 ${page === 1 ? "bg-indigo-600 text-slate-200" : "dark:text-slate-200 text-zinc-800"
              }`}
            onClick={() => handlePageChange(1)}
          >
            <span className="text-base font-semibold">1</span>
          </button>
        );

        if (startPage > 2) {
          pages.push(
            <div key="ellipsis-start" className="w-8 h-8">
              ...
            </div>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            className={`hover:bg-gray-400 dark:hover:bg-gray-800 rounded-md w-8 h-8 ${page === i ? "bg-indigo-600 text-slate-200" : "dark:text-slate-200 text-zinc-800"
              }`}
            onClick={() => handlePageChange(i)}
          >
            <span className="text-base font-semibold">{i}</span>
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <div key="ellipsis-end" className="w-8 h-8 text-base font-semibold text-zinc-800 dark:text-slate-200">
              ...
            </div>
          );
        }

        pages.push(
          <button
            key={totalPages}
            className={`hover:bg-gray-400 dark:hover:bg-gray-800 rounded-md w-8 h-8 ${page === totalPages ? "bg-indigo-600 text-slate-200" : "dark:text-slate-200 text-zinc-800"
              }`}
            onClick={() => handlePageChange(totalPages)}
          >
            <span className="text-base font-semibold">{totalPages}</span>
          </button>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex w-full justify-center gap-x-2 mt-4">
      <button
        className="hover:bg-gray-400 dark:hover:bg-gray-800 rounded-md w-8 h-8"
        onClick={() => handlePageChange(page - 1)}
      >
        <span className="text-base font-semibold">&lt;</span>
      </button>

      {generatePageNumbers()}

      <button
        className="hover:bg-gray-400 dark:hover:bg-gray-800 rounded-md w-8 h-8"
        onClick={() => handlePageChange(page + 1)}
      >
        <span className="text-base font-semibold">&gt;</span>
      </button>
    </div>
  );
};

export default Pagination;
