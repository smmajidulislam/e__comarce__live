"use client";
import { useEffect, useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "@/app/features/order/orderApi";
import { toast } from "react-toastify";
const statusOptions = ["Pending", "On The Way", "Delivered", "Cancelled"];
const approvalOptions = ["Pending", "Approved", "Rejected"];
const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const { data } = useGetAllOrdersQuery();
  const [orders, setOrders] = useState([]);
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data?.data) {
      setOrders(data.data);
    }
  }, [data]);

  const handleUpdate = async (id, field, value) => {
    const order = orders.find((o) => o._id === id);
    if (!order) return;

    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, [field]: value } : o))
    );

    await updateOrder({ id, data: { [field]: value } });
    toast.success("Order updated successfully");
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    toast.success("Order deleted successfully");
    setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-6 md:px-8 text-black dark:text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage and track all customer orders.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left text-sm font-semibold">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Total</th>
              <th className="p-4">Products</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Delivery</th>
              <th className="p-4">Admin Approval</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 text-black dark:text-white">
            {paginatedOrders.map((order, index) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-4">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="p-4">${order.totalAmount}</td>
                <td className="p-4">
                  <p>{order.products?.length ?? 0} product(s)</p>
                </td>
                <td className="p-4">
                  <select
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded-md text-sm"
                    value={order.paid ? "Paid" : "Unpaid"}
                    onChange={(e) =>
                      handleUpdate(order._id, "paid", e.target.value === "Paid")
                    }
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>
                <td className="p-4">
                  <select
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded-md text-sm"
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleUpdate(order._id, "orderStatus", e.target.value)
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <select
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded-md text-sm"
                    value={order.adminApprovalStatus || "Pending"}
                    onChange={(e) =>
                      handleUpdate(
                        order._id,
                        "adminApprovalStatus",
                        e.target.value
                      )
                    }
                  >
                    {approvalOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
    </div>
  );
}
