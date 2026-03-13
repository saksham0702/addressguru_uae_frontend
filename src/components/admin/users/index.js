"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import DeleteConfirmModal from "../cities/deletemodal";
import { deleteUser, getUsers, loginAsUser } from "@/api/uaeadminlogin";

const roleMap = {
  1: "Admin",
  2: "Editor",
  3: "Agent",
  4: "BDE",
  5: "User",
};

const roleRedirect = {
  1: "/admin/dashboard",
  2: "/editor/dashboard",
  3: "/agent/dashboard",
  4: "/bde/dashboard",
  5: "/dashboard",
};

export default function UsersTable() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res?.data?.users || []);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // OPEN DELETE MODAL
  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setDeleteModal(true);
  };

  // DELETE USER
  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);

      setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));

      setDeleteModal(false);
      setSelectedUserId(null);
    } catch (err) {
      console.log("Failed to delete user", err);
    }
  };

  // LOGIN AS USER
  const handleLoginUser = async (userId) => {
    try {
      const res = await loginAsUser(userId);

      const token = res?.data?.token;
      const role = res?.data?.role;

      if (token) {
        localStorage.setItem("token", token);
      }

      router.push(roleRedirect[role] || "/dashboard");
    } catch (error) {
      console.error("Login as user failed", error);
    }
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-8xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="text-[#FF6E04]" size={22} />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Users Management
              </h2>
              <p className="text-sm text-gray-500">
                Manage all registered users
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/admin/users/create")}
            className="flex items-center gap-2 bg-[#FF6E04] hover:bg-[#e65f00] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr className="text-left">
                <th className="px-8 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Login</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    Loading users...
                  </td>
                </tr>
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    No users found
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-8 py-4 font-medium text-gray-800">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.phone || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-[#FF6E04]">
                      {roleMap[user.roles?.[0]] || "User"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                      Active
                    </span>
                  </td>

                  {/* Login Button */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleLoginUser(user._id)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      Login
                    </button>
                  </td>

                  <td className="px-6 py-4 flex justify-end gap-3">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 transition"
                      onClick={() =>
                        router.push(`/admin/users/update/${user._id}`)
                      }
                    >
                      <Pencil size={16} className="text-gray-500" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(user._id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}
