import React, { useEffect, useState } from "react";
import "sweetalert2/src/sweetalert2.scss";
import Modal from "react-modal";
import APITableLibrarian from "../../api/table.api";

Modal.setAppElement("#root");

// 🧩 Type định nghĩa theo API trả về
interface User {
    _id: string;
    fullname: string;
    email: string;
}

interface Book {
    _id: string;
    title: string;
    price: number;
}

interface BookDetail {
    price: number;
    date: string;
    transaction_type: string;
    status: string;
}

export interface Table {
    _id: string;
    user_id: User;
    book_id: Book;
    borrow_date: string;
    status: "active" | "inactive";
    quantity: number;
    book_detail: BookDetail;
    deleted: boolean;
    createdAt: string;
}

interface ApiResponse {
    message: string;
    data: Table[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const TableListBorrow: React.FC = () => {
    const token = localStorage.getItem("token");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [tableList, setTableList] = useState<Table[]>([]);
    const [keySearch, setKeySearch] = useState("");

    // ✅ Lấy danh sách đặt sách
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            let url = APITableLibrarian.listBookOrders;
            const params: string[] = [];
            if (statusFilter) params.push(`action=${statusFilter}`);
            if (keySearch.trim() !== "")
                params.push(`keyword=${encodeURIComponent(keySearch)}`);
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
                    const data: ApiResponse = await res.json();
                    setTableList(data.data);
                })
                .catch((e) => console.error("❌ Lỗi khi tải dữ liệu:", e));
        }, 600);

        return () => clearTimeout(timeoutId);
    }, [statusFilter, keySearch, token]);

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            {/* Tiêu đề */}
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    📚 Quản lý đặt lịch mượn sách
                </h1>
            </div>

            {/* Bộ lọc & tìm kiếm */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 mb-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
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
                    {/* Tìm kiếm */}
                    <div className="col-span-2">
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="relative flex items-center"
                        >
                            <input
                                type="text"
                                placeholder="🔍 Tìm theo tên người dùng hoặc tên sách..."
                                value={keySearch}
                                onChange={(e) => setKeySearch(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400 transition"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
                            >
                                Tìm
                            </button>
                        </form>
                    </div>

                    {/* Bộ lọc trạng thái */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm text-gray-700 transition"
                        >
                            <option value="">📋 Tất cả trạng thái</option>
                            <option value="active">✅ Hoạt động</option>
                            <option value="inactive">🚫 Ngưng bán</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm uppercase tracking-wider">
                        <tr>
                            <th className="px-5 py-4">#</th>
                            <th className="px-5 py-4">Người dùng</th>
                            <th className="px-5 py-4">Tên sách</th>
                            <th className="px-5 py-4">Ngày mượn</th>
                            <th className="px-5 py-4">Số lượng</th>
                            <th className="px-5 py-4">Tổng giá</th>
                            <th className="px-5 py-4 text-center">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableList.length > 0 ? (
                            tableList.map((item, idx) => (
                                <tr
                                    key={item._id}
                                    className="border-b last:border-0 hover:bg-blue-50 transition"
                                >
                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {idx + 1}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">
                                                {item.user_id.fullname}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {item.user_id.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-medium">
                                        {item.book_id.title}
                                    </td>
                                    <td className="px-5 py-4">
                                        {new Date(item.borrow_date).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="px-5 py-4 text-center">{item.quantity}</td>
                                    <td className="px-5 py-4 font-semibold text-gray-800">
                                        {item.book_detail.price.toLocaleString("vi-VN")}₫
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {item.status === "active" ? "Hoạt động" : "Ngưng bán"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-10 text-gray-500 font-medium"
                                >
                                    Không có dữ liệu đặt sách nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableListBorrow;
