"use client";
import { useGetCategoriesQuery } from "@/app/features/category/categoryApi";
import CategoryRow from "./CategoryRow";

export default function CategoryTable({ onEdit }) {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.data || [];
  if (isLoading) return <div className="p-4">Loading...</div>;

  const renderCategoryRows = (categoryList) => {
    const rows = [];

    categoryList.forEach((category) => {
      rows.push(
        <CategoryRow key={category._id} category={category} onEdit={onEdit} />
      );

      if (category.children && category.children.length > 0) {
        category.children.forEach((child) => {
          rows.push(
            <CategoryRow
              key={child._id}
              category={{ ...child, parent: category }}
              onEdit={onEdit}
            />
          );
        });
      }
    });

    return rows;
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow rounded-lg">
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Category Name</th>
            <th className="px-6 py-4">Parent</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-200">
          {renderCategoryRows(categories)}
        </tbody>
      </table>
    </div>
  );
}
