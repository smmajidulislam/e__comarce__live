"use client";
import { useState } from "react";

const demoOrders = [
  {
    id: 1,
    customer: "Majidul Islam",
    total: 120,
    paymentStatus: "pending",
    deliveryStatus: "pending",
    date: "2025-07-08",
  },
  {
    id: 2,
    customer: "John Doe",
    total: 250,
    paymentStatus: "paid",
    deliveryStatus: "on the way",
    date: "2025-07-07",
  },
  {
    id: 3,
    customer: "Jane Smith",
    total: 99,
    paymentStatus: "cancelled",
    deliveryStatus: "cancelled",
    date: "2025-07-06",
  },
  {
    id: 4,
    customer: "Akhter",
    total: 560,
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    date: "2025-07-05",
  },
];

export default function OrderTable({ currentPage }) {
  const [orders, setOrders] = useState(demoOrders);

  const handlePaymentUpdate = (id, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, paymentStatus: status } : order
      )
    );
    console.log("Call Payment API with:", { id, status });
  };

  const handleDeliveryUpdate = (id, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, deliveryStatus: status } : order
      )
    );
    console.log("Call Delivery API with:", { id, status });
  };

  const pageSize = 3;
  const paginated = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow rounded-lg">
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Delivery</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-200">
          {paginated.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
              <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    handlePaymentUpdate(order.id, e.target.value)
                  }
                  className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm dark:bg-gray-800"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={order.deliveryStatus}
                  onChange={(e) =>
                    handleDeliveryUpdate(order.id, e.target.value)
                  }
                  className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm dark:bg-gray-800"
                >
                  <option value="pending">Pending</option>
                  <option value="on the way">On The Way</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
