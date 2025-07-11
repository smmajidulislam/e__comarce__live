"use client";
import { useGetUsersQuery } from "@/app/features/adminUserList/userapi";
import UserRow from "./UserRow";

export default function UserTable({ onEdit }) {
  const { data, isLoading } = useGetUsersQuery();
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow rounded-lg">
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Joined</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-200">
          {!isLoading &&
            data?.map((user) => (
              <UserRow key={user?._id} user={user} onEdit={onEdit} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
