"use client";
import { useDeleteCategoryMutation } from "@/app/features/category/categoryApi";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
export default function CategoryRow({ category, onEdit }) {
  const [deleteCategory] = useDeleteCategoryMutation();
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      {/* Category Name */}
      <td className="px-6 py-4 whitespace-nowrap font-medium">
        {category.name}
      </td>

      {/* Parent Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-block px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          {category?.parent?.name || "—"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        {/* Edit Button */}
        <button
          onClick={() => onEdit(category)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 rounded transition"
        >
          <Pencil size={14} />
          Edit
        </button>

        {/* Delete Button */}
        <button
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300 rounded transition"
          onClick={() => {
            deleteCategory(category._id);
            toast.success("Category deleted successfully");
          }}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </td>
    </tr>
  );
}
