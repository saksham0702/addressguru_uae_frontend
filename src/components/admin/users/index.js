"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  Calendar,
  LogIn,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";
import { useRouter } from "next/navigation";

import DeleteConfirmModal from "../cities/deletemodal";
import { deleteUser, getUsers, loginAsUser } from "@/api/uaeadminlogin";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { socket } from "@/lib/socket";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

const roleMap = {
  1: "Admin",
  2: "Editor",
  3: "Agent",
  4: "BDE",
  5: "User",
};

const LIMIT = 20;

function getAvatarUrl(avatar) {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://"))
    return avatar;
  return `${APP_URL}/${avatar}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLastActive(dateStr) {
  if (!dateStr) return "—";
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

function UserAvatar({ user }) {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = getAvatarUrl(user.avatar);
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (avatarUrl && !imgError) {
    return (
      <Image
        src={avatarUrl}
        alt={user.name}
        height={500}
        width={500}
        onError={() => setImgError(true)}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6E04] to-[#ffaa6e] flex items-center justify-center ring-2 ring-white shadow flex-shrink-0">
      <span className="text-white text-xs font-bold">{initials}</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function UsersTable() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [onlineFilter, setOnlineFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = useCallback(async (currentPage, currentSearch) => {
    setLoading(true);
    try {
      const res = await getUsers({
        page: currentPage,
        limit: LIMIT,
        search: currentSearch,
        isOnline: onlineFilter,
      });
      const data = res?.data;
      console.log("data", data);
      setUsers(data?.users || []);
      setTotal(data?.total || 0);
      setTotalPages(Math.ceil((data?.total || 0) / LIMIT));
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search, fetchUsers, onlineFilter]);

  useEffect(() => {
    socket.on("user-status-changed", (data) => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === data.userId
            ? {
                ...user,
                isOnline: data.isOnline,
                lastSeen: data.lastSeen,
              }
            : user,
        ),
      );
    });

    return () => {
      socket.off("user-status-changed");
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);
      setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
      setTotal((prev) => prev - 1);
      setDeleteModal(false);
      setSelectedUserId(null);
    } catch (err) {
      console.log("Failed to delete user", err);
    }
  };

  const handleLoginUser = async (userId) => {
    try {
      const response = await loginAsUser(userId);
      const { authToken, adminBackupToken, user } = response?.data?.data;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("token", adminBackupToken);
      if (user) setUser(user);
      window.open("/dashboard", "_blank");
    } catch (error) {
      console.error("Login as user failed", error);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-8xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Users size={18} className="text-[#FF6E04]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Users Management
              </h2>
              <p className="text-xs text-gray-500">{total} registered users</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/admin/users/create")}
            className="flex items-center gap-2 bg-[#FF6E04] hover:bg-[#e65f00] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
          >
            <Plus size={15} />
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-gray-50">
          <div className="relative max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6E04]/20 focus:border-[#FF6E04] transition placeholder:text-gray-400"
            />
          </div>
          {/* online offline filter */}
          <select
            value={onlineFilter}
            onChange={(e) => {
              setPage(1);
              setOnlineFilter(e.target.value);
            }}
            className="border font-sans rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Users</option>
            <option value="true">Online</option>
            <option value="false">Offline</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>

            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Last Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan="5" className="text-center py-14">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-7 h-7 border-2 border-[#FF6E04] border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-400">Loading users...</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-14">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={30} className="text-gray-200" />
                      <p className="text-sm text-gray-400">No users found</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-orange-50/20 transition-colors duration-100"
                  >
                    {/* User: avatar + name + email + phone */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                              {user.name}
                            </p>

                            <span
                              className={`w-2 h-2 rounded-full ${
                                user.isOnline ? "bg-green-500" : "bg-gray-300"
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Mail
                              size={11}
                              className="text-gray-400 flex-shrink-0"
                            />
                            <span className="text-xs text-gray-500 truncate">
                              {user.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Phone
                              size={11}
                              className="text-gray-400 flex-shrink-0"
                            />
                            <span className="text-xs text-gray-500">
                              {user.phone
                                ? `${user.country_code || ""} ${user.phone}`.trim()
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role + Login Source */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        {/* Role */}
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck
                            size={13}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {roleMap[user.roles?.[0]] || "User"}
                          </span>
                        </div>
                        {/* Login source */}
                        <div className="flex items-center gap-1.5">
                          {user.login_type === "google" ? (
                            <>
                              <GoogleIcon />
                              <span className="text-xs text-gray-500">
                                Google
                              </span>
                            </>
                          ) : (
                            <>
                              <Mail
                                size={11}
                                className="text-gray-400 flex-shrink-0"
                              />
                              <span className="text-xs text-gray-500">
                                Email
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-1.5">
                        <Calendar
                          size={13}
                          className="text-gray-400 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {formatDate(user.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400">Registered</p>
                        </div>
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-1.5">
                        <Clock
                          size={13}
                          className="text-gray-400 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {user.isOnline
                              ? "Online"
                              : formatLastActive(
                                  user.lastSeen || user?.lastActive,
                                )}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(user.lastSeen || user?.lastActive)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleLoginUser(user._id)}
                          title="Login as user"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all duration-150"
                        >
                          <LogIn size={12} />
                          Login
                        </button>
                        <button
                          title="Edit"
                          onClick={() =>
                            router.push(`/admin/users/update/${user._id}`)
                          }
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all duration-150"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDeleteClick(user._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {(page - 1) * LIMIT + 1}
              </span>
              {" – "}
              <span className="font-semibold text-gray-700">
                {Math.min(page * LIMIT, total)}
              </span>
              {" of "}
              <span className="font-semibold text-gray-700">{total}</span> users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    p === page
                      ? "bg-[#FF6E04] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

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
