"use client";

import {
  Edit2,
  Trash2,
  Plus,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoryRow({
  category,
  subCategories,
  index,
  onEdit,
  onDelete,
}) {
  const router = useRouter();

  const children = subCategories.filter((sub) => sub.parentId === category._id);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(category);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition">
        {/* Index */}
        <td className="px-6 py-4 text-gray-400 text-sm">{index + 1}</td>

        {/* Category Name */}
        <td className="px-6 py-4 font-semibold text-gray-800">
          {category.name}
        </td>

        {/* ICON */}
        <td className="px-6 py-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200 shadow-sm">
            {category.iconSvg ? (
              <div
                className="w-7 h-7 text-indigo-600 [&>svg]:w-7 [&>svg]:h-7"
                dangerouslySetInnerHTML={{ __html: category.iconSvg }}
              />
            ) : (
              <ImageIcon size={22} className="text-gray-400" />
            )}
          </div>
        </td>

        {/* Type */}
        <td className="px-6 py-4 capitalize text-sm">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
            {category.type}
          </span>
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={() =>
                router.push(`/admin/categories/additional-info/${category._id}`)
              }
              className="rounded-md border border-gray-200 p-2 hover:bg-gray-100 transition"
            >
              <Settings size={16} />
            </button>

            <button
              onClick={() => router.push(`/admin/categories/${category.slug}`)}
              className="rounded-md border border-gray-200 p-2 hover:bg-green-50 text-green-600 transition"
            >
              <Plus size={16} />
            </button>

            <button
              onClick={() =>
                router.push(`/admin/categories/edit/${category._id}`)
              }
              className="rounded-md border border-gray-200 p-2 hover:bg-blue-50 text-blue-600 transition"
            >
              <Edit2 size={16} />
            </button>

            <button
              onClick={handleDelete}
              className="rounded-md border border-gray-200 p-2 hover:bg-red-50 text-red-600 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}
