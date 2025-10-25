import React, { useState,useEffect } from "react";
import { Search, Users, HomeIcon } from "lucide-react";
import APIUsers from "../../api/getusers.api";

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
    // Lấy danh sách Users
      useEffect(() => {
        fetch(APIUsers.getAllUsers)
          .then((res) => res.json())
          .then((data) => setUsers(data))
          .catch((err) => console.error(err));
      }, []);


//   const handleToggleStatus = (id: number) => {
//     setUsers((prev) =>
//       prev.map((u) =>
//         u.id === id
//           ? { ...u, status: u.status === "active" ? "banned" : "active" }
//           : u
//       )
//     );
//   };



  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white/10 backdrop-blur-md text-gray-200 flex flex-col justify-between py-8 px-6 shadow-lg border-r border-white/20">
        <div>
          <h1 className="text-2xl font-bold text-white mb-8">📚 Library Admin</h1>
          <nav className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
              <HomeIcon size={20} />
              <span className="text-white font-medium">Trang chủ thống kế</span>
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
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white">Quản lý người dùng</h2>
          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-5 py-2 shadow-inner border border-white/10 w-1/3">
            <Search className="text-white/70 mr-3" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="bg-transparent text-white placeholder-white/50 w-full outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table container */}
        <div className="bg-white/95 rounded-2xl shadow-2xl p-6 backdrop-blur-md border border-white/30">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="text-left py-3 px-4">Tên người dùng</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Vai trò</th>
                <th className="text-center py-3 px-4">Trạng thái</th>
                <th className="text-center py-3 px-4 rounded-tr-xl">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-t border-gray-700 hover:bg-[#334155] transition"
                >
                    <td className="py-3 px-4 font-semibold text-gray-800">{user.fullname}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-gray-600">{user.role_id.title === "thủ thư" ? "Thủ thư" : "Người dùng"}
</td>
                  <td
                    className={`py-3 text-center font-semibold ${
                      user.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.status === "active" ? "Hoạt động" : "Khóa"}
                  </td>
                  <td className="py-3 text-center">
                    <button
                      className={`px-5 py-2 rounded-full font-semibold text-white shadow transition ${
                        user.status === "active"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {user.status === "active" ? "Ban" : "Unban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
