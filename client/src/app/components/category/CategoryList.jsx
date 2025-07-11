// 📄 CategoryList.jsx
"use client";
import { useState } from "react";
import CategoryHeader from "./CategoryHeader";
import CategoryTable from "./CategoryTable";
import CategoryFormModal from "./CategoryFormModal";

export default function CategoryList() {
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  return (
    <section className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <CategoryHeader onAddClick={() => setShowForm(true)} />
        <CategoryTable
          onEdit={(category) => {
            setEditCategory(category);
            setShowForm(true);
          }}
        />
        {showForm && (
          <CategoryFormModal
            category={editCategory}
            onClose={() => {
              setEditCategory(null);
              setShowForm(false);
            }}
          />
        )}
      </div>
    </section>
  );
}
