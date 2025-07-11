"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/app/features/product/productApi";
import AddOrEditProductModal from "./AddProductModal";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

export default function ProductTable() {
  const { data, isLoading } = useGetProductsQuery({});
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct] = useDeleteProductMutation();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Load data when fetch is done
  useEffect(() => {
    if (data?.data) {
      setProducts(data.data);
    }
  }, [data]);

  const handleEdit = (product) => {
    setEditMode(true);
    setSelectedProduct(product);
    toast.success("Product edited successfully");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    toast.success("Product deleted successfully");
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="mt-8">
      <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow rounded-lg">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price ($)</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4">{product.title}</td>
                  <td className="px-6 py-4 capitalize">
                    {product.category?.name}
                  </td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inline Pagination */}
      <div className="mt-6 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === totalPages
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Next
        </button>
      </div>

      {showModal && (
        <AddOrEditProductModal
          setShowModal={setShowModal}
          mode={editMode ? "edit" : "add"}
          initialData={selectedProduct}
        />
      )}
    </div>
  );
}
