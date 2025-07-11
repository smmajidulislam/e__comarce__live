"use client";
import {
  useGetSettingQuery,
  useDeleteLogoMutation,
} from "../../../../features/setting/settingApi";
import SettingsModal from "../../../components/settings/SettingsModal";
import { useState } from "react";

const SettingsPage = () => {
  const { data: settingData, isLoading } = useGetSettingQuery();
  const [deleteLogo] = useDeleteLogoMutation();
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = async () => {
    await deleteLogo();
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black dark:text-white text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 sm:p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-black dark:text-white">
          Website Settings
        </h1>

        {settingData?.logo && (
          <div className="flex flex-col items-center gap-2">
            <img
              src={settingData.logo}
              alt="Logo"
              className="w-full p-2 h-32 object-cover rounded border border-gray-300 dark:border-gray-700"
            />
            <button
              onClick={handleDelete}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Logo
            </button>
          </div>
        )}

        <div className="space-y-3 text-center sm:text-left">
          <p className="text-black dark:text-white">
            <strong>Facebook:</strong> {settingData?.facebook}
          </p>
          <p className="text-black dark:text-white">
            <strong>Twitter:</strong> {settingData?.twitter}
          </p>
          <p className="text-black dark:text-white">
            <strong>WhatsApp:</strong> {settingData?.whatsapp}
          </p>
          <p className="text-black dark:text-white">
            <strong>Gmail:</strong> {settingData?.gmail}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setOpenModal(true)}
            className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
          >
            Edit Settings
          </button>
        </div>
      </div>

      {openModal && (
        <SettingsModal
          settingData={settingData}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;
