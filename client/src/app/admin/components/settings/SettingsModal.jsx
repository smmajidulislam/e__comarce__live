"use client";
import { useForm } from "react-hook-form";
import { uploadToCloudinary } from "../../../utils/cloudnary";
import { useUpdateSettingMutation } from "../../../features/setting/settingApi";
import { useEffect, useState } from "react";

const SettingsModal = ({ settingData, onClose }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [updateSetting] = useUpdateSettingMutation();
  const [imagePreview, setImagePreview] = useState(settingData?.logo || "");

  useEffect(() => {
    reset(settingData);
  }, [settingData, reset]);

  const onSubmit = async (data) => {
    let logoUrl = settingData.logo;

    if (data.logo?.[0]) {
      logoUrl = await uploadToCloudinary(data.logo[0]);
    }

    await updateSetting({ ...data, logo: logoUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Edit Settings
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("facebook")}
            placeholder="Facebook"
            className="w-full px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            {...register("twitter")}
            placeholder="Twitter"
            className="w-full px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            {...register("whatsapp")}
            placeholder="WhatsApp"
            className="w-full px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            {...register("gmail")}
            placeholder="Gmail"
            className="w-full px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="file"
            accept="image/*"
            {...register("logo")}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white"
            onChange={(e) =>
              setImagePreview(URL.createObjectURL(e.target.files[0]))
            }
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-20 h-20 object-cover mt-2"
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
