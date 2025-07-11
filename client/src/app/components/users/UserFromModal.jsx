"use client";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/app/features/adminUserList/userapi";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { uploadToCloudinary } from "@/app/utils/cloudnary";
import { toast } from "react-toastify";

export default function UserFormModal({ user, onClose }) {
  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      image: user?.image || "",
      password: "", // নতুন অ্যাড
    },
  });

  const [preview, setPreview] = useState(user?.image || "");

  const watchFile = watch("file");

  useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      const file = watchFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (user?.image) {
      setPreview(user.image);
    } else {
      setPreview("");
    }
  }, [watchFile, user?.image]);

  const onSubmit = async (d) => {
    let imageUrl = d.image || "";

    if (d.file && d.file.length > 0) {
      imageUrl = await uploadToCloudinary(d.file[0]);
      setValue("image", imageUrl);
    }

    const userData = {
      name: d.name,
      email: d.email,
      phone: d.phone,
      image: imageUrl,
    };

    if (user) {
      // Update ইউজারের জন্য password পাঠানো হচ্ছে না
      try {
        await updateUser({
          id: user._id,
          ...userData,
        }).unwrap();

        toast.success("User updated successfully");
      } catch (err) {
        toast.error("Failed to update user");
      }
    } else {
      await createUser({
        ...userData,
        password: d.password,
      });

      toast.success("User created successfully");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {user ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name", { required: true })}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required</p>
          )}

          <input
            {...register("email", { required: true })}
            placeholder="Email"
            type="email"
            className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Email is required</p>
          )}

          <input
            {...register("phone", { required: true })}
            placeholder="Phone"
            type="tel"
            className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">Phone is required</p>
          )}

          {/* নতুন: Password */}
          {!user && (
            <>
              <input
                {...register("password", { required: !user })}
                placeholder="Password"
                type="password"
                className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">Password is required</p>
              )}
            </>
          )}

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("file")}
              className="w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded-md"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {user ? "Update User" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}
