import React, { useState, useEffect } from "react";
import { Search, Users, HomeIcon, Plus, Key } from "lucide-react";
import APIUsers from "../../api/getusers.api";

interface Role {
  _id: string;
  title: string;
}

interface User {
  _id: string;
  fullname: string;
  email: string;
  status: "active" | "banned";
  role_id: Role;
}

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal đổi mật khẩu
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Modal tạo thủ thư
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLibrarian, setNewLibrarian] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  const apiFetch = async (url: string, options: any = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  };

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(APIUsers.getAllLib);
      if (!res.ok) throw new Error("Không thể lấy danh sách người dùng");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      alert("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBanUser = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn KHÓA người dùng này không?")) return;
    try {
      const res = await apiFetch(`${APIUsers.banUser}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "banned" }),
      });
      if (!res.ok) throw new Error("Khóa người dùng thất bại");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: "banned" } : u))
      );
    } catch (err: any) {
      console.error(err);
      alert("Có lỗi xảy ra khi khóa người dùng.");
    }
  };

  const handleUnbanUser = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn MỞ KHÓA người dùng này không?")) return;
    try {
      const res = await apiFetch(`${APIUsers.unBanUser}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "active" }),
      });
      if (!res.ok) throw new Error("Mở khóa người dùng thất bại");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: "active" } : u))
      );
    } catch (err: any) {
      console.error(err);
      alert("Có lỗi xảy ra khi mở khóa người dùng.");
    }
  };

  // Mở modal đổi mật khẩu
  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(true);
  };

  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword || !confirmPassword) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Xác nhận mật khẩu không khớp!");
      return;
    }
    try {
      const res = await apiFetch(`${APIUsers.changePassword}/${selectedUser._id}`, {
        method: "PATCH",
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      if (!res.ok) throw new Error("Đổi mật khẩu thất bại");
      alert("Đổi mật khẩu thành công!");
      setShowPasswordModal(false);
    } catch (err: any) {
      console.error(err);
      alert("Có lỗi xảy ra khi đổi mật khẩu.");
    }
  };

  // Mở modal tạo thủ thư
  const openCreateModal = () => {
    setNewLibrarian({ fullname: "", email: "", password: "", confirmPassword: "" });
    setShowCreateModal(true);
  };

  const handleCreateLibrarian = async () => {
    const { fullname, email, password, confirmPassword } = newLibrarian;

    if (!fullname || !email || !password || !confirmPassword) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      alert("Xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const res = await apiFetch(`${APIUsers.createLibrarian}`, {
        method: "POST",
        body: JSON.stringify({ fullname, email, password, confirmPassword }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Tạo tài khoản thất bại");
      }

      alert("Tạo tài khoản thủ thư thành công!");
      setShowCreateModal(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra khi tạo tài khoản thủ thư.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullname.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-gray-900 relative">
      {/* Sidebar */}
      <aside className="w-72 bg-white/10 backdrop-blur-md text-gray-200 flex flex-col justify-between py-8 px-6 shadow-lg border-r border-white/20">
        <div>
          <h1 className="text-2xl font-bold text-white mb-8">📚 Library Admin</h1>
          <nav className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
              <HomeIcon size={20} />
              <span className="text-white font-medium">Trang chủ thống kê</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition">
              <Users size={20} />
              <span className="text-gray-300">Quản lý người dùng</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition">
              <span>📘</span>
              <span className="text-gray-300">Quản lý sách</span>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold text-white">Quản lý người dùng</h2>
          <div className="flex-1 flex items-center gap-4">
            <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-5 py-2 shadow-inner border border-white/10 w-full transition-all duration-300 hover:scale-105">
              <Search className="text-white/70 mr-3" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                className="bg-transparent text-white placeholder-white/50 w-full outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 hover:shadow-xl transition transform shadow-md"
            >
              <Plus size={18} />
              Thêm thủ thư mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/95 rounded-2xl shadow-2xl p-6 backdrop-blur-md border border-white/30">
          {loading ? (
            <div className="text-center py-20 text-gray-600 font-semibold">Đang tải dữ liệu...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-gray-600 font-semibold">Không có người dùng nào</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                  <th className="text-left py-3 px-4">Tên người dùng</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Vai trò</th>
                  <th className="text-center py-3 px-4">Trạng thái</th>
                  <th className="text-center py-3 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-semibold text-gray-800">{user.fullname}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.role_id?.title === "thủ thư" ? "Thủ thư" : "Người dùng"}
                    </td>
                    <td
                      className={`py-3 text-center font-semibold ${
                        user.status === "active" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.status === "active" ? "Hoạt động" : "Khóa"}
                    </td>
                    <td className="py-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => openPasswordModal(user)}
                        className="flex items-center gap-1 px-4 py-2 rounded-full font-semibold text-white bg-yellow-500 hover:bg-yellow-600 hover:scale-105 shadow-md transition transform"
                      >
                        <Key size={16} />
                        Đổi mật khẩu
                      </button>
                      {user.status === "active" ? (
                        <button
                          onClick={() => handleBanUser(user._id)}
                          className="px-4 py-2 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 hover:scale-105 shadow-md transition transform"
                        >
                          Ban
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnbanUser(user._id)}
                          className="px-4 py-2 rounded-full font-semibold text-white bg-green-500 hover:bg-green-600 hover:scale-105 shadow-md transition transform"
                        >
                          Unban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal đổi mật khẩu */}
        {showPasswordModal && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-96 p-6 animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Đổi mật khẩu: {selectedUser.fullname}
              </h3>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-yellow-400 outline-none transition"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition font-semibold"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal tạo thủ thư */}
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-96 p-6 animate-fade-in">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Tạo tài khoản thủ thư mới</h3>
              <input
                type="text"
                placeholder="Tên đầy đủ"
                value={newLibrarian.fullname}
                onChange={(e) => setNewLibrarian({ ...newLibrarian, fullname: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                type="email"
                placeholder="Email"
                value={newLibrarian.email}
                onChange={(e) => setNewLibrarian({ ...newLibrarian, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={newLibrarian.password}
                onChange={(e) => setNewLibrarian({ ...newLibrarian, password: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={newLibrarian.confirmPassword}
                onChange={(e) => setNewLibrarian({ ...newLibrarian, confirmPassword: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateLibrarian}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-semibold"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
