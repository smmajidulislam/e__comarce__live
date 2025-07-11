export default function CategoryHeader({ onAddClick }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Categories
      </h2>
      <button
        onClick={onAddClick}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        + Add Category
      </button>
    </div>
  );
}
