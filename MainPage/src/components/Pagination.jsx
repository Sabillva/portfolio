import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-6 bg-[#222] p-3 rounded-3xl border-2 border-white/20">
      {/* Sol Ox */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 hover:text-black transition"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Səhifə Nömrələri */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 text-sm rounded-full transition ${
              currentPage === page
                ? "bg-green-400 text-black font-semibold"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Sağ Ox */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 hover:text-black transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
