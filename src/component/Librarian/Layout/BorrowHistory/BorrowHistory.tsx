import { Search } from "lucide-react";

function BorrowHistory() {
    const data = [
        {
            id: 1,
            title: "Đắc nhân tâm",
            borrowDate: "10/09/2025",
            returnDate: "12/12/2099",
            status: "Đã trả",
        },
        {
            id: 2,
            title: "Nhà giả kim",
            borrowDate: "11/09/2025",
            returnDate: "01/01/2099",
            status: "Đang mượn",
        },
        {
            id: 3,
            title: "Lược sử loài người",
            borrowDate: "12/09/2025",
            returnDate: "15/09/2025",
            status: "Quá hạn",
        },
    ];

    const statusColor = (status: string) => {
        if (status === "Đã trả") return "text-green-500 font-medium";
        if (status === "Đang mượn") return "text-orange-400 font-medium";
        if (status === "Quá hạn") return "text-red-500 font-medium";
        return "text-gray-400";
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center flex items-start justify-center p-12"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            {/* Overlay làm mờ ảnh nền */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Nội dung */}
            <div className="relative z-10 w-full max-w-7xl flex gap-8">
                {/* Sidebar - Tổng quan */}
                <div className="bg-slate-900/85 text-white rounded-xl p-8 w-72 shadow-lg">
                    <h2 className="text-2xl font-bold mb-8">Tổng quan</h2>
                    <p className="text-4xl font-bold">100</p>
                    <p className="text-slate-300 mb-6">Tổng số sách đã mượn</p>

                    <p className="text-4xl font-bold">13</p>
                    <p className="text-slate-300 mb-6">Sách đang mượn</p>

                    <p className="text-4xl font-bold">0</p>
                    <p className="text-slate-300">Sách quá hạn</p>
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-900/80 rounded-xl p-10 shadow-lg">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        LỊCH SỬ MƯỢN SÁCH
                    </h1>

                    {/* Search */}
                    <div className="flex items-center bg-white rounded-lg px-3 py-2 mb-8 shadow-md">
                        <Search className="text-slate-400 w-6 h-6 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sách..."
                            className="flex-1 bg-transparent outline-none text-slate-800 text-lg"
                        />
                        <button className="ml-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-4 py-2 rounded-lg transition">
                            Tìm kiếm
                        </button>
                    </div>


                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-100 rounded-lg overflow-hidden text-lg">
                            <thead>
                                <tr className="bg-slate-800 text-slate-200">
                                    <th className="px-5 py-4">Tên sách</th>
                                    <th className="px-5 py-4">Ngày mượn</th>
                                    <th className="px-5 py-4">Hạn trả</th>
                                    <th className="px-5 py-4">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((book) => (
                                    <tr
                                        key={book.id}
                                        className="border-b border-slate-700 hover:bg-slate-800/70"
                                    >
                                        <td className="px-5 py-4">{book.title}</td>
                                        <td className="px-5 py-4">{book.borrowDate}</td>
                                        <td className="px-5 py-4">{book.returnDate}</td>
                                        <td className={`px-5 py-4 ${statusColor(book.status)}`}>
                                            {book.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
                            &lt;&lt; Trước
                        </button>
                        <button className="px-4 py-2 bg-yellow-400 text-slate-900 font-bold rounded">
                            1
                        </button>
                        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
                            2
                        </button>
                        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
                            3
                        </button>
                        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
                            4
                        </button>
                        <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
                            Sau &gt;&gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BorrowHistory;
