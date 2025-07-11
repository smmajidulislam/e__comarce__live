"use client";
import React from "react";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-6 md:px-8 text-black dark:text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your application settings
        </p>
      </div>

      {/* General Setting */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-1 mb-4">
          General Setting
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm">Update site name, logo, language etc.</p>
        </div>
      </div>

      {/* Shipping */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-1 mb-4">
          Shipping
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm">
            Configure delivery zones, charges and policies.
          </p>
        </div>
      </div>

      {/* Payment */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-1 mb-4">
          Payment
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm">
            Enable or disable payment gateways like Stripe, SSLCommerz, etc.
          </p>
        </div>
      </div>

      {/* System Setting */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-1 mb-4">
          System Setting
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm">Timezone, currency, email config, etc.</p>
        </div>
      </div>

      {/* Developer */}
      <div>
        <h2 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-700 pb-1 mb-4">
          Developer
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-sm">
            API keys, Webhook URLs, and environment setup.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
