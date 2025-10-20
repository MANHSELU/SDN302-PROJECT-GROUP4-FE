import React, { useEffect, useState } from "react";
import "sweetalert2/src/sweetalert2.scss";
import Modal from "react-modal";
import APIBookLibrarian from "../../api/book.api";
import Swal from "sweetalert2";
import type { Books } from "../../../../model/Books";
import APIBook from "../../../User/api/book.api";

Modal.setAppElement("#root");

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
    user_id_ao: User;
    book_id: Book;
    borrow_date: string;
    status: "active" | "returned" | "cancelled";
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

const BookListBorrow: React.FC = () => {
    const token = localStorage.getItem("token");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [tableList, setTableList] = useState<Table[]>([]);
    const [keySearch, setKeySearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [listBook, setListBook] = useState<Books[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Books | null>(null);

    const handleSelect = (book: Books) => {
        setSelectedBook(book);
    };
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            let url = APIBookLibrarian.listBookOrders;
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

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);

                // ✅ Tạo URL chỉ gồm page + keyword (nếu có)
                const url = `${APIBook.getBook}?page=${currentPage}${search ? `&keyword=${encodeURIComponent(search)}` : ""
                    }`;

                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                setListBook(data.data || []);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("❌ Lỗi khi lấy danh sách book:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks()
    }, [currentPage, search]);

    // ✅ Hàm gọi API Lấy sách
    const handleLaySach = async (
        bookId: string,
        borrowDate: string,
        userId: string
    ) => {
        console.log("chạy vào lấy sách")
        console.log("user là :", userId)
        try {
            // ⚠️ Hiển thị confirm popup
            const confirm = await Swal.fire({
                title: "Xác nhận lấy sách?",
                text: "Bạn có chắc chắn muốn xác nhận người dùng này đã lấy sách không?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Có, xác nhận!",
                cancelButtonText: "Hủy",
                confirmButtonColor: "#2563eb",
                cancelButtonColor: "#d33",
            });

            if (!confirm.isConfirmed) return;

            const res = await fetch(APIBookLibrarian.laySach, {
                method: "Put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: userId,
                    book_id: bookId,
                    borrow_Date: borrowDate, // backend yêu cầu đúng key này
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                Swal.fire("Lỗi!", data.message || "Không thể lấy sách", "error");
                return;
            }

            // ✅ Thông báo thành công
            Swal.fire("Thành công!", data.message || "Xác nhận lấy sách thành công!", "success");

            // ✅ Cập nhật UI tại chỗ (không cần load lại)
            setTableList((prev) =>
                prev.map((item) => {
                    const userIdToCompare = item.user_id?._id ?? item.user_id_ao?._id;
                    return item.book_id?._id === bookId && userIdToCompare === userId
                        ? { ...item, status: "cancelled" }
                        : item;
                })
            );
        } catch (error) {
            console.error("❌ Lỗi khi gọi API lấy sách:", error);
            Swal.fire("Lỗi!", "Không thể kết nối đến máy chủ", "error");
        }
    };

    const handleDaTraSach = async (
        bookId: string,
        borrowDate: string,
        userId: string
    ) => {
        try {
            // ⚠️ Hiển thị confirm popup
            const confirm = await Swal.fire({
                title: "Xác nhận lấy sách?",
                text: "Bạn có chắc chắn muốn xác nhận người dùng này đã lấy sách không?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Có, xác nhận!",
                cancelButtonText: "Hủy",
                confirmButtonColor: "#2563eb",
                cancelButtonColor: "#d33",
            });

            if (!confirm.isConfirmed) return;

            const res = await fetch(APIBookLibrarian.traSach, {
                method: "Put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token} `,
                },
                body: JSON.stringify({
                    user_id: userId,
                    book_id: bookId,
                    borrow_Date: borrowDate, // backend yêu cầu đúng key này
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                Swal.fire("Lỗi!", data.message || "Không thể lấy sách", "error");
                return;
            }

            // ✅ Thông báo thành công
            Swal.fire("Thành công!", data.message || "Xác nhận lấy sách thành công!", "success");

            // ✅ Cập nhật UI tại chỗ (không cần load lại)
            setTableList((prev) =>
                prev.map((item) => {
                    const userIdToCompare = item.user_id?._id ?? item.user_id_ao?._id;
                    return item.book_id?._id === bookId && userIdToCompare === userId
                        ? { ...item, status: "cancelled" }
                        : item;
                })
            );
        } catch (error) {
            console.error("❌ Lỗi khi gọi API lấy sách:", error);
            Swal.fire("Lỗi!", "Không thể kết nối đến máy chủ", "error");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // ✅ Ngăn reload trang

        // 🔹 Lấy dữ liệu form
        const formData = new FormData(e.currentTarget);
        const fullname = formData.get("fullname")?.toString().trim() || "";
        const email = formData.get("email")?.toString().trim() || "";
        const phone = formData.get("phone")?.toString().trim() || "";
        const quantity = parseInt(formData.get("quantityInput")?.toString() || "0");
        const note = formData.get("note")?.toString().trim() || "";

        // 🔹 Kiểm tra dữ liệu cơ bản
        if (!fullname || !email || !phone) {
            Swal.fire({
                icon: "warning",
                title: "Thiếu thông tin!",
                text: "Vui lòng nhập đầy đủ họ tên, email và số điện thoại.",
                confirmButtonColor: "#0ea5e9",
            });
            return;
        }

        if (!selectedBook || !selectedBook._id) {
            Swal.fire({
                icon: "warning",
                title: "Chưa chọn sách!",
                text: "Vui lòng chọn ít nhất 1 cuốn sách trước khi lưu.",
                confirmButtonColor: "#0ea5e9",
            });
            return;
        }

        if (quantity <= 0) {
            Swal.fire({
                icon: "error",
                title: "Số lượng không hợp lệ!",
                text: "Số lượng mượn phải lớn hơn 0.",
                confirmButtonColor: "#ef4444",
            });
            return;
        }

        try {
            // 🟢 Dữ liệu gửi lên API
            const payload = {
                fullname,
                email,
                phone,
                quantity,
                note,
                book_id: selectedBook._id,
            };

            console.log("📦 Dữ liệu gửi:", payload);


            const res = await fetch(APIBookLibrarian.bookforuser, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi khi lưu dữ liệu");

            // 🧩 Dữ liệu demo để test
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // ✅ Thông báo thành công
            Swal.fire({
                icon: "success",
                title: "Lưu thành công!",
                text: `Đã thêm người mượn: ${fullname}`,
                showConfirmButton: false,
                timer: 1500,
            });

            // 🔄 Reset form và đóng modal
            // e.currentTarget.reset();
            setSelectedBook(null);
            setIsOpen(false);

        } catch (error) {
            console.error("❌ Lỗi khi gửi dữ liệu:", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Không thể lưu dữ liệu. Vui lòng thử lại sau.",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                className="relative bg-transparent max-w-6xl w-[90%] max-h-[90vh] mx-auto rounded-2xl overflow-hidden shadow-2xl"
                overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto"
            >
                {/* Nút đóng */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-5 right-6 text-gray-300 hover:text-white text-4xl font-bold transition"
                >
                    &times;
                </button>

                {/* Nền đẹp */}
                <div className="bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')] bg-cover bg-center relative min-h-[85vh]">
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />

                    {/* Form chính */}
                    <form
                        onSubmit={handleSubmit}
                        className="relative p-10 text-gray-100 rounded-2xl w-full z-10 overflow-y-auto max-h-[85vh]"
                    >
                        <h2 className="text-4xl font-bold mb-10 text-center text-teal-400 drop-shadow-lg tracking-wide">
                            🧾 Thêm Người Mượn Sách
                        </h2>

                        {/* Lưới input chính */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Họ tên */}
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-300 mb-2">
                                    👤 Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    placeholder="Nhập họ tên người mượn"
                                    className="w-full bg-gray-800/70 text-gray-100 placeholder-gray-400 h-12 px-4 
              rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 
              outline-none transition-all duration-200"
                                />
                            </div>

                            {/* Email */}
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-300 mb-2">
                                    📧 Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Nhập email người mượn"
                                    className="w-full bg-gray-800/70 text-gray-100 placeholder-gray-400 h-12 px-4 
              rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 
              outline-none transition-all duration-200"
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div className="col-span-1">
                                <label className="block text-base font-medium text-gray-300 mb-2">
                                    📞 Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    placeholder="Nhập số điện thoại"
                                    className="w-full bg-gray-800/70 text-gray-100 placeholder-gray-400 h-12 px-4 
              rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 
              outline-none transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Số lượng + ghi chú */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <div>
                                <label className="block text-base font-medium text-gray-300 mb-2">
                                    📦 Số lượng
                                </label>
                                <input
                                    type="number"
                                    id="quantityInput"
                                    name="quantityInput"
                                    placeholder="Nhập số lượng mượn"
                                    min={1}
                                    className="w-full bg-gray-800/70 text-gray-100 placeholder-gray-400 h-12 px-4 
              rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 
              outline-none transition-all duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-base font-medium text-gray-300 mb-2">
                                    📝 Ghi chú
                                </label>
                                <textarea
                                    id="note"
                                    name="note"
                                    placeholder="Nhập ghi chú thêm (nếu có)"
                                    className="w-full bg-gray-800/70 text-gray-100 placeholder-gray-400 h-28 px-4 py-3 
              rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 
              outline-none transition-all duration-200 resize-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-base font-medium text-gray-300 mb-2">
                                📘 Sách đã chọn
                            </label>

                            {selectedBook ? (
                                <div className="flex items-center gap-4 bg-gray-800/70 border border-gray-700 rounded-lg p-4">
                                    {/* Ảnh sách (nếu có) */}
                                    {selectedBook.image && selectedBook.image.length > 0 ? (
                                        <img
                                            src={selectedBook.image[0]}
                                            alt={selectedBook.title}
                                            className="w-20 h-28 object-cover rounded-md border border-gray-600"
                                        />
                                    ) : (
                                        <div className="w-20 h-28 bg-gray-700 flex items-center justify-center text-gray-400 text-sm rounded-md">
                                            No Image
                                        </div>
                                    )}

                                    {/* Thông tin chi tiết */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-teal-300">
                                            {selectedBook.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            Tác giả:{" "}
                                            <span className="text-gray-200">
                                                {selectedBook.authors?.name || "—"}
                                            </span>
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Giá:{" "}
                                            <span className="text-green-400 font-medium">
                                                {selectedBook.price?.toLocaleString("vi-VN")}₫
                                            </span>
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Số lượng:{" "}
                                            <span className="text-gray-200 font-medium">
                                                {selectedBook.quantity}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Nút xóa chọn */}
                                    <button
                                        onClick={() => setSelectedBook(null)}
                                        className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                                    >
                                        ❌ Bỏ chọn
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Chưa chọn sách nào</p>
                            )}
                        </div>

                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6 text-teal-400 text-center">📚 Chọn sách</h2>

                            {/* Tìm kiếm */}
                            <div className="mb-4 flex justify-between items-center">
                                <input
                                    type="text"
                                    placeholder="🔍 Tìm sách..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-gray-800 px-4 py-2 rounded-md focus:ring-2 focus:ring-teal-400"
                                />
                            </div>

                            {/* Bảng */}
                            <div className="max-h-[400px] overflow-y-auto border border-gray-700 rounded-lg">
                                <table className="min-w-full text-left">
                                    <thead className="sticky top-0 bg-gray-800 text-gray-300 uppercase text-sm">
                                        <tr>
                                            <th className="px-5 py-3">#</th>
                                            <th className="px-5 py-3">Tên sách</th>
                                            <th className="px-5 py-3">Tác giả</th>
                                            <th className="px-5 py-3 text-center">Giá</th>
                                            <th className="px-5 py-3 text-center">Ảnh</th>
                                            <th className="px-5 py-3 text-center">Số lượng</th>
                                            <th className="px-5 py-3 text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-400">
                                                    Đang tải...
                                                </td>
                                            </tr>
                                        ) : listBook.length > 0 ? (
                                            listBook.map((book, idx) => (
                                                <tr
                                                    key={book._id}
                                                    className={`border-b border-gray-700 hover:bg-gray-800 ${selectedBook?._id === book._id ? "bg-teal-900/60" : ""
                                                        }`}
                                                >
                                                    <td className="px-5 py-3">{idx + 1}</td>
                                                    <td className="px-5 py-3 font-semibold text-teal-300">{book.title}</td>
                                                    <td className="px-5 py-3">{book.authors?.name || "—"}</td>
                                                    <td className="px-5 py-3 text-center text-green-400">
                                                        {book.price?.toLocaleString("vi-VN")}₫
                                                    </td>

                                                    <td className="px-5 py-3 text-center text-green-400">
                                                        <img
                                                            src={book.image?.[0] || "/no-image.jpg"}
                                                            alt={book.title}
                                                            className="w-full h-12 object-cover"
                                                        />
                                                    </td>
                                                    <td className="px-5 py-3 text-center">{book.quantity}</td>
                                                    <td className="px-5 py-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelect(book)}
                                                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${selectedBook?._id === book._id
                                                                ? "bg-green-500 text-white"
                                                                : "bg-teal-500 text-white hover:bg-teal-600"
                                                                }`}
                                                        >
                                                            {selectedBook?._id === book._id ? "✅ Đã chọn" : "📖 Chọn"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-8 text-gray-400 italic">
                                                    Không có sách phù hợp
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Phân trang */}
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-sm text-gray-400">
                                    Trang {currentPage}/{totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-md bg-gray-800 border border-gray-700 disabled:opacity-40"
                                    >
                                        ⬅ Trước
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-md bg-gray-800 border border-gray-700 disabled:opacity-40"
                                    >
                                        Sau ➡
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="
    relative
    px-8 py-3 
    font-semibold text-lg
    rounded-xl 
    text-white
    bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500
    shadow-lg shadow-teal-500/30
    hover:from-teal-600 hover:via-cyan-500 hover:to-blue-600
    transition-all duration-300
    hover:scale-[1.05] active:scale-[0.97]
    focus:ring-4 focus:ring-cyan-400/50
    flex items-center gap-2 justify-center
     ml-auto
  "
                        >

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                                />
                            </svg>
                            Lưu Người Mượn
                        </button>

                    </form>
                </div>
            </Modal >


            <div className="p-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
                {/* Tiêu đề */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow-sm">
                        📚 Quản lý đặt lịch mượn sách
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Theo dõi và cập nhật trạng thái mượn – trả sách
                    </p>
                </div>

                {/* Bộ lọc & tìm kiếm */}
                <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                            🔍 Bộ lọc & Tìm kiếm
                        </h2>
                        <button
                            onClick={() => {
                                setKeySearch("");
                                setStatusFilter("");
                            }}
                            className="text-base text-gray-600 hover:text-blue-700 transition font-medium"
                        >
                            ↺ Đặt lại
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Ô tìm kiếm */}
                        <div className="col-span-2">
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    placeholder="Nhập tên người dùng hoặc tên sách..."
                                    value={keySearch}
                                    onChange={(e) => setKeySearch(e.target.value)}
                                    className="w-full px-5 py-3 text-lg rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400 transition"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition"
                                >
                                    Tìm kiếm
                                </button>
                            </form>
                        </div>

                        {/* Bộ lọc trạng thái */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 text-lg rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700 transition"
                            >
                                <option value="">📋 Tất cả trạng thái</option>
                                <option value="active">🕓 Chưa lấy sách</option>
                                <option value="cancelled">📘 Đã lấy sách</option>
                                <option value="returned">✅ Đã trả sách</option>
                            </select>
                        </div>
                    </div>
                </div>
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
                        Tạo người dùng mượn sách
                    </button>
                </div>
                {/* Bảng dữ liệu */}
                <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-200">
                    <table className="min-w-full text-base text-left text-gray-800">
                        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white uppercase">
                            <tr>
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Người dùng</th>
                                <th className="px-6 py-4">Tên sách</th>
                                <th className="px-6 py-4">Ngày mượn</th>
                                <th className="px-6 py-4">Số lượng</th>
                                <th className="px-6 py-4">Tổng giá</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableList.length > 0 ? (
                                tableList.map((item, idx) => (
                                    <tr
                                        key={item._id}
                                        className="border-b hover:bg-blue-50 transition duration-150"
                                    >
                                        <td className="px-6 py-4 font-semibold">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-blue-800 text-lg">
                                                    {item.user_id?.fullname ?? item.user_id_ao?.fullname ?? "—"}

                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {item.user_id?.email ?? item.user_id_ao?.email ?? "—"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-lg text-gray-800">
                                            {item.book_id.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {new Date(item.borrow_date).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {item.book_detail.price.toLocaleString("vi-VN")}₫
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline - block px - 4 py - 1.5 rounded - full text - sm font - semibold ${item.status === "active"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : item.status === "cancelled"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-green-100 text-green-700"
                                                    } `}
                                            >
                                                {item.status === "active"
                                                    ? "🕓 Chưa lấy sách"
                                                    : item.status === "cancelled"
                                                        ? "📘 Đã lấy sách"
                                                        : "✅ Đã trả sách"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            {item.status === "active" ? (
                                                <button
                                                    onClick={() =>
                                                        handleLaySach(
                                                            item.book_id?._id,
                                                            item.borrow_date,
                                                            item.user_id?._id ?? item.user_id_ao?._id
                                                        )
                                                    }

                                                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 shadow-sm transition"
                                                >
                                                    📚 Lấy sách
                                                </button>
                                            ) : item.status === "cancelled" ? (
                                                <button
                                                    onClick={() =>
                                                        handleDaTraSach(
                                                            item.book_id?._id,
                                                            item.borrow_date,
                                                            item.user_id?._id ?? item.user_id_ao?._id
                                                        )
                                                    }
                                                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-green-500 text-white hover:bg-green-600 shadow-sm transition"
                                                >
                                                    ✅ Trả Sách
                                                </button>
                                            ) : (
                                                <span className="inline-block px-3 py-1.5 bg-green-100 text-green-800 font-semibold rounded-full shadow-sm border border-green-300">
                                                    ✅ Đã trả sách
                                                </span>

                                            )}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center py-12 text-gray-500 font-medium text-lg"
                                    >
                                        Không có dữ liệu đặt sách nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    );
};

export default BookListBorrow;
