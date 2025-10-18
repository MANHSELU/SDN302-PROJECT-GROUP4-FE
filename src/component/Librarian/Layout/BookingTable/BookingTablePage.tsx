import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import Modal from "react-modal"; // ✅ import react-modal
import type { Table } from "../../../../model/Table";
import APITableLibranrian from "../../api/table.api";

// ⚙️ Cấu hình root element cho Modal
Modal.setAppElement("#root");

const TableList: React.FC = () => {
    const token = localStorage.getItem("token");

    const [statusFilter, setStatusFilter] = useState<string>("");
    const [tableList, setTableList] = useState<Table[]>([]);
    const [keySearch, setKeySearch] = useState("");
    const [isOpen, setIsOpen] = useState(false); // ✅ modal state
    // edit table 
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editTable, setEditTable] = useState<Table | null>(null);
    const [newTable, setNewTable] = useState({
        title: "",
        price: "",
        status: "active",
    });

    // ✅ Lấy danh sách bàn
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            let url = APITableLibranrian.getUserTable;
            const params: string[] = [];
            if (statusFilter) params.push(`action=${statusFilter}`);
            if (keySearch.trim() !== "") params.push(`keyword=${encodeURIComponent(keySearch)}`);
            if (params.length > 0) url += `?${params.join("&")}`;

            console.log("🔗 API URL:", url);

            fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then((data) => {
                    setTableList(data.data);
                })
                .catch((e) => console.error("❌ Lỗi khi tải dữ liệu:", e));
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [statusFilter, keySearch, token]);

    // ✅ Đổi trạng thái hoạt động
    const handleChangeStatus = (id: string) => {
        fetch(`${APITableLibranrian.chanegTable}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(() => {
                setTableList((prev) =>
                    prev.map((b) =>
                        b._id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b
                    )
                );
            })
            .catch((err) => console.error("Đổi trạng thái thất bại:", err));
    };

    // ✅ fill dữ liệu lên 
    const handleEdit = async (id: string) => {
        setIsEditOpen(true); // ✅ mở modal ngay lập tức (có thể show loading)
        setEditTable(null);  // reset dữ liệu cũ

        try {
            const res = await fetch(`${APITableLibranrian.updateTable}/${id}`, {
                method: "GET", // ✅ dùng GET để lấy dữ liệu chi tiết
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ thêm token
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // ✅ fill dữ liệu từ API vào form
            setEditTable({
                _id: data.data._id,
                title: data.data.title,
                price: data.data.price,
                status: data.data.status as "active" | "inactive",
            });


        } catch (error) {
            console.error("❌ Lỗi khi lấy dữ liệu bàn:", error);
            Swal.fire({
                icon: "error",
                title: "Không thể tải dữ liệu!",
                text: "Vui lòng thử lại sau.",
            });
            setIsEditOpen(false);
        }
    };


    // chỉnh sửa table 
    const handleUpdateTable = async (e: React.FormEvent) => {
        e.preventDefault(); // ✅ ngăn reload trang

        if (!editTable) return;

        try {
            const res = await fetch(`${APITableLibranrian.updateTable}/${editTable._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: editTable.title,
                    price: editTable.price,
                    status: editTable.status,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Cập nhật thành công!",
                    timer: 1500,
                    showConfirmButton: false,
                });

                // ✅ cập nhật state, không reload
                setTableList((prev) =>
                    prev.map((t) => (t._id === editTable._id ? { ...t, ...editTable } : t))
                );

                setIsEditOpen(false);
                setEditTable(null);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Cập nhật thất bại!",
                    text: data.message || "Không thể cập nhật mục này.",
                });
            }
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật:", err);
        }
    };

    // ✅ Xóa
    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${APITableLibranrian.deleteTable}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Xóa thành công!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setTableList((prev) => prev.filter((item) => item._id !== id));
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xóa thất bại!",
                    text: data.message || "Không thể xóa mục này.",
                });
            }
        } catch (error) {
            console.error("❌ Lỗi khi xóa:", error);
        }
    };

    // ✅ Thêm mới sản phẩm (qua Modal)
    const handleAddTable = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(APITableLibranrian.addTable, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newTable),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Thêm mới thành công!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setTableList((prev) => [...prev, data.data]);
                setIsOpen(false);
                setNewTable({ title: "", price: "", status: "active" });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Thêm thất bại!",
                    text: data.message || "Dữ liệu không hợp lệ.",
                });
            }
        } catch (err) {
            console.error("❌ Lỗi khi thêm:", err);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Danh sách sản phẩm</h1>

            {/* Bộ lọc */}
            <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        🔎 Bộ lọc & Tìm kiếm
                    </h2>
                    <button
                        onClick={() => {
                            setKeySearch("");
                            setStatusFilter("");
                        }}
                        className="text-sm text-gray-600 hover:text-blue-600 transition"
                    >
                        Đặt lại
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Ô tìm kiếm */}
                    <div className="col-span-2">
                        <form
                            className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="text"
                                placeholder="Nhập từ khóa..."
                                value={keySearch}
                                onChange={(e) => setKeySearch(e.target.value)}
                                className="flex-1 px-4 py-2 text-gray-700 focus:outline-none placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold transition"
                            >
                                Tìm
                            </button>
                        </form>
                    </div>

                    {/* Bộ lọc trạng thái */}
                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Ngưng bán</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Nút thêm mới */}
            <div className="mb-6">
                <button
                    onClick={() => setIsOpen(true)} // ✅ mở modal
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm mới
                </button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3 text-left">STT</th>
                            <th className="p-3 text-left">Tiêu đề</th>
                            <th className="p-3 text-left">Giá</th>
                            <th className="p-3 text-left">Trạng thái</th>
                            <th className="p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {tableList.length > 0 ? (
                            tableList.map((item, idx) => (
                                <tr key={item._id} className="border-b hover:bg-gray-100 transition">
                                    <td className="p-3">{idx + 1}</td>
                                    <td className="p-3">{item.title}</td>
                                    <td className="p-3 text-green-600">
                                        {item.price ? `${item.price.toLocaleString()} ₫` : "—"}
                                    </td>
                                    <td className="p-3">
                                        <button
                                            className={`px-3 py-1 rounded ${item.status === "active"
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                                }`}
                                            onClick={() => handleChangeStatus(item._id ?? "")}
                                        >
                                            {item.status === "active" ? "Hoạt động" : "Ngưng bán"}
                                        </button>
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item._id ?? "")}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id ?? "")}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal thêm mới */}
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full mx-auto mt-20 p-8 text-gray-100 border border-gray-700"
                overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
                {/* Header */}
                <h2 className="text-3xl font-semibold mb-8 text-center text-white tracking-wide border-b border-gray-700 pb-4">
                    ✨ Thêm sản phẩm mới
                </h2>

                <form onSubmit={handleAddTable} className="space-y-6">
                    {/* Tiêu đề */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            🏷️ Tiêu đề sản phẩm
                        </label>
                        <input
                            type="text"
                            required
                            value={newTable.title}
                            onChange={(e) => setNewTable({ ...newTable, title: e.target.value })}
                            placeholder="Nhập tên sản phẩm..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-400 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                        />
                    </div>

                    {/* Giá */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            💰 Giá (VNĐ)
                        </label>
                        <input
                            type="number"
                            required
                            min={0}
                            value={newTable.price}
                            onChange={(e) => setNewTable({ ...newTable, price: e.target.value })}
                            placeholder="Nhập giá sản phẩm..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-400 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                        />
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            ⚙️ Trạng thái
                        </label>
                        <select
                            value={newTable.status}
                            onChange={(e) => setNewTable({ ...newTable, status: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                        >
                            <option value="active">🟢 Hoạt động</option>
                            <option value="inactive">🔴 Ngưng bán</option>
                        </select>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-700 mt-8">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                        >
                            ❌ Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all duration-200"
                        >
                            💾 Lưu sản phẩm
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal
                isOpen={isEditOpen}
                onRequestClose={() => setIsEditOpen(false)}
                className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full mx-auto mt-20 p-8 text-gray-100 border border-gray-700"
                overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
                <h2 className="text-3xl font-semibold mb-8 text-center text-white tracking-wide border-b border-gray-700 pb-4">
                    ✏️ Chỉnh sửa sản phẩm
                </h2>

                {editTable && (
                    <form onSubmit={handleUpdateTable} className="space-y-6">
                        {/* Tiêu đề */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                🏷️ Tiêu đề sản phẩm
                            </label>
                            <input
                                type="text"
                                required
                                value={editTable.title}
                                onChange={(e) => setEditTable({ ...editTable, title: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-400 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Giá */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                💰 Giá (VNĐ)
                            </label>
                            <input
                                type="number"
                                required
                                min={0}
                                value={editTable.price}
                                onChange={(e) => setEditTable({ ...editTable, price: Number(e.target.value) })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-400 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                ⚙️ Trạng thái
                            </label>
                            <select
                                value={editTable.status}
                                onChange={(e) =>
                                    setEditTable({
                                        ...editTable,
                                        status: e.target.value as "active" | "inactive" | "",
                                    })
                                }

                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                            >
                                <option value="active">🟢 Hoạt động</option>
                                <option value="inactive">🔴 Ngưng bán</option>
                            </select>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-700 mt-8">
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                            >
                                ❌ Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all duration-200"
                            >
                                💾 Lưu thay đổi
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default TableList;
