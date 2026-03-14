"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import CategoryRow from "./categoryrow";

export default function CategoryTable({
  categories = [],
  onEdit,
  onDelete,
  isLoading,
}) {
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 text-center text-sm text-gray-500">
        Loading categories…
      </div>
    );
  }

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const parentCategories = filteredCategories.filter((c) => !c.parentId);
  const subCategories = filteredCategories.filter((c) => c.parentId);

  return (
    <div className="space-y-4">
      {/* SEARCH */}
      <div className="relative w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="max-h-[550px] overflow-y-auto orange-scrollbar">
          <table className="min-w-full table-fixed text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="w-16 px-6 py-3 font-medium">#</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="w-32 px-8 py-3 font-medium">Icon</th>
                <th className="w-40 px-10 py-3 font-medium">Type</th>
                <th className="w-40 px-6 py-3 text-center font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {parentCategories.map((category, index) => (
                <CategoryRow
                  key={category._id}
                  index={index}
                  category={category}
                  subCategories={subCategories}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
