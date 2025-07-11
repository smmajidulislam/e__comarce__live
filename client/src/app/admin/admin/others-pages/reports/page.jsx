"use client";
import { useGetProductReportQuery } from "@/app/features/reportApi/reportApi";
import React, { useEffect, useState } from "react";

const ReportsPage = () => {
  const { data, isLoading, error } = useGetProductReportQuery();
  const [reports, setReports] = useState(null);
  useEffect(() => {
    if (data?.data?.analytics) {
      setReports(data.data?.analytics);
    }
  }, [data, isLoading, error]);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-6 md:px-8 text-black dark:text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Reports</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Summary of business performance
        </p>
      </div>

      {/* Sells Report Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-1 border-gray-300 dark:border-gray-700">
          Sells Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium">Today’s Sales</h3>
            <p className="text-2xl font-bold mt-2">${reports?.todaySales}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium">This Month</h3>
            <p className="text-2xl font-bold mt-2">${reports?.thisMonth}</p>
          </div>
        </div>
      </div>

      {/* Payment Report Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-1 border-gray-300 dark:border-gray-700">
          Payment Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium">Successful Payments</h3>
            <p className="text-2xl font-bold mt-2">
              ${reports?.successfulPayments}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium">Failed Payments</h3>
            <p className="text-2xl font-bold mt-2">
              ${reports?.failedPayments}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
