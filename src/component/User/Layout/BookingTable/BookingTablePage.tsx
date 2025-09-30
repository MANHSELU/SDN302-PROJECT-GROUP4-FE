import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function BookingTablePage() {
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // ✅ Tạo timeSlots từ 7h → 22h
    const timeSlots = Array.from({ length: 16 }, (_, i) => {
        const start = 7 + i;
        const end = start + 1;
        return {
            startTime: `${start}:00`,
            endTime: `${end}:00`,
            status: "available",
        };
    });

    // Ví dụ đánh dấu 12h và 18h đã đặt
    timeSlots[5].status = "booked";   // 12:00 - 13:00
    timeSlots[11].status = "booked";  // 18:00 - 19:00

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center p-8"
            style={{
                backgroundImage:
                    "url('https://img.freepik.com/free-photo/bookshelf-library_1150-11114.jpg')",
            }}
        >
            <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md rounded-2xl p-6 text-white">
                <h1 className="text-3xl font-bold mb-6">Đặt Bàn</h1>

                {/* Select Table */}
                <div className="mb-4">
                    <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg cursor-pointer">
                        <span>{selectedTable || "Tại bàn"}</span>
                        <ChevronDown />
                    </div>
                </div>

                {/* Select Date */}
                <div className="mb-6">
                    <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg cursor-pointer">
                        <span>{selectedDate || "Ngày-Tháng-Năm"}</span>
                        <ChevronDown />
                    </div>
                </div>

                {/* Time Slots Table */}
                <div className="mb-6 overflow-x-auto">
                    <div className="inline-block">
                        {/* Hàng hiển thị Start–End time */}
                        <div className="flex min-w-max mb-1">
                            {timeSlots.map((slot, idx) => (
                                <div
                                    key={idx}
                                    className="w-24 text-xs font-semibold text-white text-center"
                                >
                                    {slot.startTime} - {slot.endTime}
                                </div>
                            ))}
                        </div>

                        {/* Hàng hiển thị slot trạng thái */}
                        <div className="flex min-w-max">
                            {timeSlots.map((slot, idx) => (
                                <div
                                    key={idx}
                                    className={`w-24 h-16 border border-gray-500 cursor-pointer transition duration-200 flex items-center justify-center text-sm ${slot.status === "booked"
                                        ? "bg-gray-300 text-red-600 font-bold"
                                        : selectedTime === slot.startTime
                                            ? "bg-green-600 text-white"
                                            : "bg-black/40 hover:bg-black/60"
                                        }`}
                                    onClick={() =>
                                        slot.status !== "booked" && setSelectedTime(slot.startTime)
                                    }
                                >
                                    {slot.status === "booked" ? "Đã đặt" : "Trống"}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                {/* Booking Info */}
                <div className="bg-black/50 p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-3">Thông tin đặt lịch</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>Họ tên người đặt :</span>
                        <span className="text-right">__________</span>
                        <span>Ngày Tháng Năm :</span>
                        <span className="text-right">{selectedDate || "--/--/----"}</span>
                        <span>Khung giờ :</span>
                        <span className="text-right">{selectedTime || "Chưa chọn"}</span>
                        <span>Số bàn :</span>
                        <span className="text-right">{selectedTable || "Chưa chọn"}</span>
                        <span>Tổng tiền :</span>
                        <span className="text-right font-bold text-lg text-green-400">
                            1.000.000 VND
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300">
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
