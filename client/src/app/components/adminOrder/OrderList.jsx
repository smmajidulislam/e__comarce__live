"use client";
import { useState } from "react";
import OrderTable from "./OrderTable";
import Pagination from "../adminProducts/Pagination";

export default function OrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <section className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Orders
        </h2>
        <OrderTable currentPage={currentPage} />
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </section>
  );
}
