export default function Pagination({ currentPage, setCurrentPage }) {
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className="px-4 py-2 border rounded-l-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
      >
        Previous
      </button>
      <span className="px-4 py-2 border-t border-b bg-white dark:bg-gray-900 text-black dark:text-white">
        Page {currentPage}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="px-4 py-2 border rounded-r-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
      >
        Next
      </button>
    </div>
  );
}
