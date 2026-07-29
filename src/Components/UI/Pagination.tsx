import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const startRange = Math.min((currentPage - 1) * limit + 1, totalItems);
  const endRange = Math.min(currentPage * limit, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const range: number[] = [];
    const delta = 1; // Number of pages to show before and after current page

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // Left ellipsis indicator
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-2); // Right ellipsis indicator
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 mt-6 bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Items count metadata */}
      <div className="text-sm text-gray-500 font-medium">
        Showing{" "}
        <span className="text-[#1a6b5a] font-semibold">{totalItems === 0 ? 0 : startRange}</span>
        {" - "}
        <span className="text-[#1a6b5a] font-semibold">{endRange}</span> of{" "}
        <span className="text-gray-900 font-bold">{totalItems}</span> items
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl text-gray-400 hover:text-[#1a6b5a] hover:bg-[#1a6b5a]/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all duration-200"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl text-gray-500 hover:text-[#1a6b5a] hover:bg-[#1a6b5a]/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all duration-200"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, index) => {
            if (p < 0) {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-400 text-sm tracking-widest selection:bg-transparent"
                >
                  ...
                </span>
              );
            }

            const isActive = p === currentPage;

            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`relative px-3 py-1.5 min-w-[36px] text-sm font-semibold rounded-xl transition-all duration-300 transform active:scale-95 ${
                  isActive
                    ? "bg-[#1a6b5a] text-white shadow-md shadow-[#1a6b5a]/25 scale-105"
                    : "text-gray-600 hover:bg-[#1a6b5a]/10 hover:text-[#1a6b5a]"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-xl text-gray-500 hover:text-[#1a6b5a] hover:bg-[#1a6b5a]/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all duration-200"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-xl text-gray-400 hover:text-[#1a6b5a] hover:bg-[#1a6b5a]/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all duration-200"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Page Size & Quick Jump */}
      <div className="flex items-center gap-4">
        {/* Page size limit select */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span>Show:</span>
          <select
            value={limit}
            onChange={(e) => {
              onLimitChange(Number(e.target.value));
              onPageChange(1); // reset to page 1
            }}
            className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-semibold focus:outline-none focus:border-[#1a6b5a] transition-all cursor-pointer"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Quick jump to page */}
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span>Go to:</span>
          <input
            type="number"
            min={1}
            max={totalPages || 1}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (val >= 1 && val <= totalPages) {
                onPageChange(val);
              }
            }}
            className="w-12 px-1.5 py-1 text-center bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-semibold focus:outline-none focus:border-[#1a6b5a] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
