"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { uploadToCloudinary } from "@/app/utils/cloudnary";
import {
  useGetSlidersQuery,
  useCreateSliderMutation,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} from "@/app/features/sliderApi/sliderApi";
import { toast } from "react-toastify";

const Page = () => {
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data, refetch, isLoading } = useGetSlidersQuery();
  const [createSlider] = useCreateSliderMutation();
  const [updateSlider] = useUpdateSliderMutation();
  const [deleteSlider] = useDeleteSliderMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const file = formData.image[0];
    if (!file) return;

    const imageUrl = await uploadToCloudinary(file);

    if (editId) {
      await updateSlider({
        id: editId,
        data: { image: imageUrl },
      }).unwrap();
      setEditId(null);
      setShowModal(false);
      toast.success("Slider updated successfully");
    } else {
      await createSlider({ image: imageUrl }).unwrap();
      toast.success("Slider created successfully");
    }

    reset();
    refetch();
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteSlider(id).unwrap();
    toast.success("Slider deleted successfully");
    refetch();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-4">
      <h1 className="text-xl font-bold mb-4 text-center">
        Slider Image Upload
      </h1>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md space-y-4 max-w-md mx-auto"
      >
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Image is required" })}
          className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        />
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          {editId ? "Update Image" : "Upload Image"}
        </button>
      </form>

      {/* All Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {isLoading ? (
          <p className="col-span-3 text-center">Loading...</p>
        ) : (
          data?.data?.map((img) => (
            <div
              key={img._id}
              className="bg-white dark:bg-gray-800 p-2 rounded-md shadow"
            >
              <img
                src={img.image}
                alt="Slider"
                className="w-full h-48 object-cover rounded"
              />
              <div className="flex justify-between mt-2 text-sm">
                <button
                  onClick={() => handleEdit(img._id)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-11/12 max-w-md">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4 text-center">
              Update Image
            </h2>
            <EditForm
              onCancel={() => {
                setShowModal(false);
                setEditId(null);
              }}
              onUpdate={onSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Modal Form
const EditForm = ({ onCancel, onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        type="file"
        accept="image/*"
        {...register("image", { required: "Image is required" })}
        className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />
      {errors.image && (
        <p className="text-red-500 text-sm">{errors.image.message}</p>
      )}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-sm bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Page;
