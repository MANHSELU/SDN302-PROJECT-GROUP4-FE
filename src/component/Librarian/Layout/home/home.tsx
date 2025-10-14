import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { CalendarDays, BookOpen, Users } from "lucide-react";

export default function HomeLibrarian() {
    // Dữ liệu mẫu (có thể sau này thay bằng API thật)
    const [bookStats, setBookStats] = useState([
        { category: "Văn học", count: 120 },
        { category: "Khoa học", count: 80 },
        { category: "Công nghệ", count: 60 },
        { category: "Thiếu nhi", count: 40 },
    ]);

    const [tableBookings, setTableBookings] = useState([
        { id: 1, name: "Nguyễn Minh Hòa", date: "2025-10-13", time: "09:00" },
        { id: 2, name: "Trần Thị Lan", date: "2025-10-13", time: "13:30" },
    ]);

    const [bookBorrowings, setBookBorrowings] = useState([
        { id: 1, user: "Phạm Anh Tuấn", book: "Lập trình Python", date: "2025-10-12" },
        { id: 2, user: "Lê Thu Trang", book: "Tư duy phản biện", date: "2025-10-11" },
    ]);

    const [returnedBooks, setReturnedBooks] = useState([
        { id: 1, user: "Nguyễn Văn Nam", book: "Đắc nhân tâm", returned: "2025-10-10" },
        { id: 2, user: "Trần Thanh Huy", book: "Giải tích 1", returned: "2025-10-09" },
        { id: 3, user: "Lâm Thị Hòa", book: "Kinh tế học cơ bản", returned: "2025-10-08" },
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-gray-100 p-10">
            {/* Header */}
            <h1 className="text-4xl font-bold text-teal-400 text-center mb-10">
                📚 Trang chủ Thủ Thư
            </h1>

            {/* --- Dashboard Stats --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg text-gray-300">Tổng số lượng sách</h3>
                        <p className="text-3xl font-bold text-teal-400 mt-2">
                            {bookStats.reduce((sum, b) => sum + b.count, 0)}
                        </p>
                    </div>
                    <BookOpen className="text-teal-400 w-10 h-10" />
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg text-gray-300">Lịch đặt bàn hôm nay</h3>
                        <p className="text-3xl font-bold text-teal-400 mt-2">
                            {tableBookings.length}
                        </p>
                    </div>
                    <CalendarDays className="text-teal-400 w-10 h-10" />
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg text-gray-300">Người đã trả sách</h3>
                        <p className="text-3xl font-bold text-teal-400 mt-2">
                            {returnedBooks.length}
                        </p>
                    </div>
                    <Users className="text-teal-400 w-10 h-10" />
                </div>
            </div>

            {/* --- Chart: Số lượng sách --- */}
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 mb-12">
                <h2 className="text-2xl font-semibold text-teal-400 mb-6">
                    Biểu đồ số lượng sách theo thể loại
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="category" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #475569",
                                borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#a5f3fc" }}
                        />
                        <Bar dataKey="count" fill="#14b8a6" barSize={40} radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* --- Bookings + Borrowings + Returns --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Lịch đặt bàn */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md">
                    <h2 className="text-xl font-semibold text-teal-400 mb-4">
                        🪑 Lịch đặt bàn
                    </h2>
                    <ul className="space-y-3">
                        {tableBookings.map((item) => (
                            <li
                                key={item.id}
                                className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition"
                            >
                                <p className="font-semibold text-gray-100">{item.name}</p>
                                <p className="text-sm text-gray-400">
                                    {item.date} - {item.time}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Lịch đặt sách */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md">
                    <h2 className="text-xl font-semibold text-teal-400 mb-4">
                        📘 Lịch đặt sách
                    </h2>
                    <ul className="space-y-3">
                        {bookBorrowings.map((b) => (
                            <li
                                key={b.id}
                                className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition"
                            >
                                <p className="font-semibold text-gray-100">
                                    {b.user} – <span className="text-teal-400">{b.book}</span>
                                </p>
                                <p className="text-sm text-gray-400">Ngày: {b.date}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Danh sách người trả sách */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-md">
                    <h2 className="text-xl font-semibold text-teal-400 mb-4">
                        ✅ Người đã trả sách
                    </h2>
                    <ul className="space-y-3">
                        {returnedBooks.map((r) => (
                            <li
                                key={r.id}
                                className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition"
                            >
                                <p className="font-semibold text-gray-100">
                                    {r.user} – <span className="text-teal-400">{r.book}</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    Ngày trả: {r.returned}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
