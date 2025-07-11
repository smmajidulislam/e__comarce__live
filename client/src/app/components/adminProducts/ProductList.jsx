"use client";
import AddProductModal from "./AddProductModal"; // Import modal
import { useState } from "react";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";

export default function ProductList() {
  const [filter, setFilter] = useState({ category: "", min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Products
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add New Product
          </button>
        </div>

        <ProductFilters filter={filter} setFilter={setFilter} />
        <ProductTable filter={filter} currentPage={currentPage} />
        {showModal && <AddProductModal setShowModal={setShowModal} />}
      </div>
    </section>
  );
}
