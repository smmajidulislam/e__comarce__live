export default function UserHeader({ onAddClick }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Users
      </h2>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 border text-black dark:text-white border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-sm w-full sm:w-64"
        />
        <button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add User
        </button>
      </div>
    </div>
  );
}
