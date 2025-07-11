export default function ProductFilters({ filter, setFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
      <select
        value={filter.category}
        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        className="px-4 py-2 border text-black border-gray-300 rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="home">Home</option>
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={filter.min}
        onChange={(e) => setFilter({ ...filter, min: e.target.value })}
        className="px-4 py-2 text-black border border-gray-300 rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white"
      />

      <input
        type="number"
        placeholder="Max Price"
        value={filter.max}
        onChange={(e) => setFilter({ ...filter, max: e.target.value })}
        className="text-black px-4 py-2 border border-gray-300 rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}
