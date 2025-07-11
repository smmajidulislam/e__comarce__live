"use client";
import { useState } from "react";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import UserFormModal from "./UserFromModal";

export default function UserList() {
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);

  return (
    <section className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <UserHeader onAddClick={() => setShowForm(true)} />
        <UserTable
          onEdit={(user) => {
            setEditUser(user);
            setShowForm(true);
          }}
        />
        {showForm && (
          <UserFormModal
            user={editUser}
            onClose={() => {
              setEditUser(null);
              setShowForm(false);
            }}
          />
        )}
      </div>
    </section>
  );
}
