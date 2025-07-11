"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/app/features/category/categoryApi";
import { useGetCategoriesQuery } from "@/app/features/category/categoryApi";
import { toast } from "react-toastify";

const flattenCategories = (categories, depth = 0) => {
  let flatList = [];

  categories.forEach((category) => {
    flatList.push({
      _id: category._id,
      name: category.name,
    });

    if (category.children && category.children.length > 0) {
      flatList = flatList.concat(
        flattenCategories(category.children, depth + 1)
      );
    }
  });

  return flatList;
};

export default function CategoryFormModal({ category, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const { data } = useGetCategoriesQuery();
  const categories = data?.data || [];

  // Flatten categories with indentation for dropdown
  const flatCategories = flattenCategories(categories);

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("parent", category?.parent?._id || "");
    } else {
      setValue("name", "");
      setValue("parent", "");
    }
  }, [category, setValue]);

  const onSubmit = async (formData) => {
    try {
      if (category) {
        await updateCategory({ id: category._id, data: formData }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully");
      }
      onClose();
    } catch (err) {
      toast.error("Failed to create or update category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {category ? "Edit Category" : "Add New Category"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Name */}
          <div>
            <input
              {...register("name", { required: true })}
              placeholder="Category Name"
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                Category name is required
              </p>
            )}
          </div>

          {/* Parent Dropdown */}
          <div>
            <select
              {...register("parent")}
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">Select Parent (optional)</option>
              {flatCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition"
            >
              {category ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
