"use client";

import { useDeleteUserMutation } from "@/app/features/adminUserList/userapi";
import { toast } from "react-toastify";
export default function UserRow({ user, onEdit }) {
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id) => {
    await deleteUser(id);
    toast.success("User deleted successfully");
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <td className="px-6 py-4 whitespace-nowrap">{user?.name}</td>
      <td className="px-6 py-4 whitespace-nowrap">{user?.email}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {user?.isAdmin === true ? "Admin" : "Customer"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {user?.createad
          ? new Date(user.createad).toLocaleDateString("en-GB", {
              timeZone: "Asia/Dhaka",
            })
          : "No Date"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <button
          onClick={() => onEdit(user)}
          className="text-blue-600 text-sm border-2 border-blue-600 rounded-2xl px-2 py-1"
        >
          Edit
        </button>
        <button
          className="text-red-600 text-sm border-2 border-blue-600 rounded-2xl px-2 py-1"
          onClick={() => handleDelete(user?._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
