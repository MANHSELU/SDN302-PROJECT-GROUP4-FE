import React, { useEffect, useState } from "react";
import "sweetalert2/src/sweetalert2.scss";
import Modal from "react-modal";
import APITableLibranrian from "../../api/table.api";

Modal.setAppElement("#root");

interface User {
    _id: string;
    fullname: string;
    email: string;
}

interface Table {
    _id: string;
    title: string;
    price: number;
    status: string;
}

interface TimeSlot {
    _id: string;
    start_time: string;
    end_time: string;
}

interface BookOrder {
    _id: string;
    user_id: User;
    table_id: Table;
    time_slot: TimeSlot[];
    time_date: string;
    deleted: boolean;
    status: string;
    createdAt: string;
}

const ListBookOrder: React.FC = () => {
    const token = localStorage.getItem("token");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [orders, setOrders] = useState<BookOrder[]>([]);
    const [keySearch, setKeySearch] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            let url = APITableLibranrian.ListOderTable;
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
                    console.log("📦 Dữ liệu API:", data);
                    setOrders(data.data || []);
                })
                .catch((e) => console.error("❌ Lỗi khi tải dữ liệu:", e));
        }, 600);

        return () => clearTimeout(timeoutId);
    }, [statusFilter, keySearch, token]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">📋 Danh sách đặt bàn</h1>

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
                                placeholder="Tìm theo tên khách hàng hoặc bàn..."
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
                            <option value="inactive">Ngưng hoạt động</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3 text-left">STT</th>
                            <th className="p-3 text-left">Khách hàng</th>
                            <th className="p-3 text-left">Bàn</th>
                            <th className="p-3 text-left">Giá (₫)</th>
                            <th className="p-3 text-left">Ngày đặt</th>
                            <th className="p-3 text-left">Khung giờ</th>
                            <th className="p-3 text-left">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {orders.length > 0 ? (
                            orders.map((item, idx) => (
                                <tr key={item._id} className="border-b hover:bg-gray-100 transition">
                                    <td className="p-3">{idx + 1}</td>

                                    {/* Khách hàng */}
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{item.user_id.fullname}</span>
                                            <span className="text-sm text-gray-500">{item.user_id.email}</span>
                                        </div>
                                    </td>

                                    {/* Bàn */}
                                    <td className="p-3">{item.table_id.title}</td>

                                    {/* Giá */}
                                    <td className="p-3 text-green-600">
                                        {item.table_id.price.toLocaleString()} ₫
                                    </td>

                                    {/* Ngày */}
                                    <td className="p-3">
                                        {new Date(item.time_date).toLocaleDateString("vi-VN")}
                                    </td>

                                    {/* Giờ */}
                                    <td className="p-3">
                                        {item.time_slot
                                            .map((t) => `${t.start_time} - ${t.end_time}`)
                                            .join(", ")}
                                    </td>

                                    {/* Trạng thái */}
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded text-white ${item.status === "active"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        >
                                            {item.status === "active" ? "Hoạt động" : "Ngưng"}
                                        </span>
                                    </td>


                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-6 text-gray-500">
                                    Không có dữ liệu đặt bàn
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListBookOrder;
