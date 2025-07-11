"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/app/features/product/productApi";
import { uploadToCloudinary } from "@/app/utils/cloudnary";
import { useGetCategoriesQuery } from "@/app/features/category/categoryApi";

// 👇 flatten helper
const flattenCategories = (categories) => {
  const result = [];

  const traverse = (items, prefix = "") => {
    for (let item of items) {
      const fullName = prefix ? `${prefix} > ${item.name}` : item.name;
      result.push({ _id: item._id, category: fullName });

      if (item.children && item.children.length > 0) {
        traverse(item.children, fullName);
      }
    }
  };

  traverse(categories);
  return result;
};

export default function AddOrEditProductModal({
  setShowModal,
  mode = "add",
  initialData = {},
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const [flatCategories, setFlatCategories] = useState([]);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data, error } = useGetCategoriesQuery();

  // flatten category data
  useEffect(() => {
    if (data?.data) {
      const flat = flattenCategories(data.data);
      setFlatCategories(flat);
    }
  }, [data]);

  // for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key === "category" && value?._id) {
          setValue("category", value._id);
        } else if (key === "stock") {
          const val = typeof value === "string" ? value.toLowerCase() : value;
          setValue("stock", val === "in stock" ? "instock" : "outofstock");
        } else {
          setValue(key, value);
        }
      });
      if (initialData.image || initialData.photo) {
        setPreview(initialData.image || initialData.photo);
      }
    }
  }, [mode, initialData, setValue]);

  const onSubmit = async (data) => {
    if (data.stock === "instock") data.stock = "In Stock";
    else if (data.stock === "outofstock") data.stock = "Out of Stock";

    if (data.image && data.image.length > 0) {
      const imageFile = data.image[0];
      const imageUrl = await uploadToCloudinary(imageFile);
      data.image = imageUrl;
    } else {
      delete data?.image;
    }

    if (mode === "add") {
      await createProduct(data).unwrap();
    } else {
      await updateProduct({
        id: initialData?._id,
        ...data,
      }).unwrap();
    }

    reset();
    setPreview(null);
    setShowModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 bg-white";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormGroup label="Product Name" error={errors.title}>
            <input
              {...register("title", { required: true })}
              className={inputClass}
              placeholder="Product Name"
            />
          </FormGroup>

          <FormGroup label="Category" error={errors.category}>
            <select
              {...register("category", { required: true })}
              className={inputClass}
            >
              <option value="">Select Category</option>
              {flatCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Price" error={errors.price}>
            <input
              type="number"
              {...register("price", { required: true, min: 0 })}
              className={inputClass}
              placeholder="Price"
            />
          </FormGroup>

          <FormGroup label="Stock" error={errors.stock}>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="instock"
                  {...register("stock", { required: true })}
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  In Stock
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="outofstock"
                  {...register("stock", { required: true })}
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  Out of Stock
                </span>
              </label>
            </div>
          </FormGroup>

          <FormGroup label="Description" error={errors.description}>
            <textarea
              {...register("description")}
              className={inputClass}
              rows={3}
              placeholder="Short description..."
            />
          </FormGroup>

          <FormGroup label="Photo" error={errors.image}>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: mode === "add" })}
              onChange={handleImageChange}
              className={inputClass}
            />
            {preview && (
              <div className="relative mt-3 w-28 h-28 rounded border shadow overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
          </FormGroup>

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium text-gray-800 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
            >
              {mode === "edit" ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormGroup({ label, children, error }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div>{children}</div>
      {error && <p className="text-sm text-red-500 mt-1">Required</p>}
    </div>
  );
}
