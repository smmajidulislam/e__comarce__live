"use client";
import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../../icons";
import Image from "next/image";
import { useGetDashboardStatsQuery } from "@/app/features/reportApi/reportApi";
import { useEffect, useState } from "react";

export const EcommerceMetrics = () => {
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  const [reports, setReports] = useState(null);
  useEffect(() => {
    if (!isLoading && !error && data?.data) {
      setReports(data?.data);
    }
  }, [data, isLoading, error]);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Image
            src={GroupIcon?.src}
            alt="GroupIcon Icon"
            width={24}
            height={24}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {reports?.totalCustomers}
            </h4>
          </div>
          <Badge color="success">
            <Image
              src={ArrowUpIcon?.src}
              alt="ArrowUpIcon Icon"
              width={24}
              height={24}
            />
            {reports?.customerGrowth}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* <BoxIconLine className="text-gray-800 dark:text-white/90" /> */}
          <Image
            src={BoxIconLine?.src}
            alt="BoxIconLine Icon"
            width={24}
            height={24}
          />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {reports?.totalOrders}
            </h4>
          </div>

          <Badge color="error">
            <Image
              src={ArrowDownIcon?.src}
              alt="ArrowDownIcon Icon"
              height={24}
              width={24}
            />
            {reports?.orderGrowth}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
