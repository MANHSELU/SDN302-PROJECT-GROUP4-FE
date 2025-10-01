import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TimeSlots } from "../../../../model/TimeSlot";
import APIBook from "../../api/book.api";
import type { Table } from "../../../../model/Table";
import APITable from "../../api/table.api";
import type { User_Book } from "../../../../model/User_Book";

export default function BookingTablePage() {
    const [listtable, setListTable] = useState<Table[]>([]);
    const [timeslot, setTimeSlot] = useState<TimeSlots[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlots, setSelectedSlots] = useState<TimeSlots[]>([]);
    const token = localStorage.getItem("token");
    const [booked, setBooked] = useState<User_Book[]>([])
    // ngày từ hôm nay tới 2 ngày sau
    const today = new Date();
    const dates: string[] = [];
    for (let i = 0; i <= 2; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        dates.push(d.toLocaleDateString("vi-VN")); // dd/mm/yyyy
    }

    // fetch timeslot
    useEffect(() => {
        fetch(APIBook.getSlotTime, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("HTTP status " + res.status);
                return res.json();
            })
            .then((data) => setTimeSlot(data.data))
            .catch((err) => console.log("Lỗi:", err));
    }, [token]);

    // fetch table
    useEffect(() => {
        fetch(APITable.getTable, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("HTTP status " + res.status);
                return res.json();
            })
            .then((data) => setListTable(data.data))
            .catch((err) => console.log("Lỗi:", err));
    }, []);

    useEffect(() => {
        fetch(APITable.getUserTable, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("HTTP status " + res.status);
                return res.json();
            })
            .then((data) => setBooked(data.data))
            .catch((err) => console.log("Lỗi:", err));
    }, []);
    console.log("booked là : ", booked)
    const bookedSlots = booked.flatMap(b => b.time_slot.map(id => id.toString()));
    // toggle chọn/bỏ chọn slot
    const toggleSlot = (slot: TimeSlots) => {
        if (selectedSlots.some((s) => s._id === slot._id)) {
            setSelectedSlots(selectedSlots.filter((s) => s._id !== slot._id));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    // tổng tiền = giá bàn × số slot chọn
    const totalPrice =
        (selectedTable?.price || 0) * (selectedSlots.length || 0);

    return (
        <div
            className="relative min-h-screen bg-cover bg-center flex items-start justify-center p-12"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            {/* overlay tối */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* content */}
            <div className="relative w-full max-w-4xl bg-white/10 rounded-2xl p-8 text-white shadow-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Đặt Bàn</h1>

                {/* chọn bàn */}
                <div className="mb-6 relative">
                    <select
                        value={selectedTable?._id || ""}
                        onChange={(e) =>
                            setSelectedTable(
                                listtable.find((t) => t._id === e.target.value) || null
                            )
                        }
                        className="appearance-none w-full bg-black/40 text-white p-4 rounded-lg cursor-pointer pr-10 border border-white/20 focus:ring-2 focus:ring-green-400"
                    >
                        <option value="" disabled>
                            Tại bàn
                        </option>
                        {listtable.map((table) => (
                            <option key={table._id} value={table._id} className="text-black">
                                {table.title} - {table.price} VNĐ / 1 h
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
                        <ChevronDown />
                    </div>
                </div>

                {/* chọn ngày */}
                <div className="mb-6 relative">
                    <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="appearance-none w-full p-4 rounded-lg border border-white/20 text-black cursor-pointer bg-white focus:ring-2 focus:ring-green-400"
                    >
                        <option value="" disabled>
                            Ngày-Tháng-Năm
                        </option>
                        {dates.map((date, idx) => (
                            <option key={idx} value={date}>
                                {date}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <ChevronDown />
                    </div>
                </div>

                {/* time slots */}
                <div className="mb-8 overflow-x-auto">
                    <div className="inline-block">
                        <div className="flex min-w-max mb-2">
                            {timeslot.map((slot, idx) => (
                                <div
                                    key={idx}
                                    className="w-24 text-xs font-semibold text-center text-gray-200"
                                >
                                    {slot.start_time} - {slot.end_time}
                                </div>
                            ))}
                        </div>
                        <div className="flex min-w-max">
                            {timeslot.map((slot, idx) => {
                                const isBooked = bookedSlots.includes(slot._id); // check đã đặt chưa
                                const isSelected = selectedSlots.some((s) => s._id === slot._id);

                                return (
                                    <div
                                        key={idx}
                                        className={`w-24 h-16 border border-gray-600 transition duration-200 
          flex items-center justify-center text-sm rounded-md 
          ${isBooked
                                                ? "bg-red-600 cursor-not-allowed" // đã đặt -> đỏ
                                                : isSelected
                                                    ? "bg-green-600 cursor-pointer"   // đang chọn -> xanh lá
                                                    : "bg-gray-700 hover:bg-green-500 cursor-pointer"
                                            } text-white`}
                                        onClick={() => {
                                            if (!isBooked) toggleSlot(slot); // chỉ cho click khi chưa booked
                                        }}
                                    >
                                        {isBooked ? "Đã đặt" : isSelected ? "Đã chọn" : "Trống"}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* booking info */}
                <div className="bg-black/50 p-6 rounded-lg mb-8">
                    <h2 className="text-lg font-semibold mb-4">Thông tin đặt lịch</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <span>Họ tên người đặt :</span>
                        <span className="text-right">__________</span>
                        <span>Ngày Tháng Năm :</span>
                        <span className="text-right">{selectedDate || "--/--/----"}</span>
                        <span>Khung giờ :</span>
                        <span className="text-right">
                            {selectedSlots.length > 0
                                ? selectedSlots
                                    .map((s) => `${s.start_time}-${s.end_time}`)
                                    .join(", ")
                                : "Chưa chọn"}
                        </span>
                        <span>Số bàn :</span>
                        <span className="text-right">
                            {selectedTable ? selectedTable.title : "Chưa chọn"}
                        </span>
                        <span>Tổng tiền :</span>
                        <span className="text-right font-bold text-lg text-green-400">
                            {totalPrice.toLocaleString()} VNĐ
                        </span>
                    </div>
                </div>

                {/* buttons */}
                <div className="flex gap-6">
                    <button
                        onClick={() => {
                            setSelectedDate("");
                            setSelectedSlots([]);
                            setSelectedTable(null);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
                    >
                        Tạo lại
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300">
                        Đặt lịch
                    </button>
                </div>
            </div>
        </div>
    );
}
