import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { Category } from "../../../../model/Category";
import APIBook from "../../api/book.api";
import type { Books } from "../../../../model/Books";
import { LiaHeartSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

export default function AllBooks() {
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;

    const [listcategory, setListCategory] = useState<Category[] | []>([])
    useEffect(() => {
        fetch(APIBook.getCategorylimit)
            .then(res => res.json())
            .then(
                data => setListCategory(data.data)
            )
            .catch(
                (err) => console.log("lỗi trong khi gọi danh sách book là : ", err)
            )
    }, [])

    const [listBook, setListBook] = useState<Books[] | []>([]);
    useEffect(() => {
        fetch(APIBook.getBook)
            .then(res => res.json())
            .then(
                data => setListBook(data.data)
            )
            .catch(
                (err) => console.log("lỗi trong khi gọi danh sách book là : ", err)
            )
    }, [])
    console.log("danh sách book là : ", listBook)
    // fake danh sách sách
    const books = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        title: `Book ${i + 1}`,
        author: "Tác giả",
        image: "https://via.placeholder.com/150x200.png?text=Book+Cover",
    }));

    const totalPages = Math.ceil(books.length / booksPerPage);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            {/* Tiêu đề */}
            <h1 className="text-2xl font-bold mb-6">📚 Tất cả sách</h1>

            {/* Thanh tìm kiếm */}
            <div className="relative mb-6 max-w-lg flex">
                {/* Input */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách..."
                        className="w-full px-4 py-2 pl-10 rounded-l-lg bg-slate-800 text-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>

                {/* Nút tìm kiếm */}
                <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2 
             bg-gradient-to-r from-yellow-400 to-yellow-500 
             text-black font-semibold shadow-md
             hover:from-yellow-500 hover:to-yellow-600 
             hover:scale-105 transition-all duration-200"
                >
                    <span>🔍</span>
                    <span>Tìm</span>
                </button>

            </div>


            {/* Bộ lọc */}
            <div className="flex flex-wrap gap-3 mb-8">
                <button
                    className="px-4 py-1 rounded-full bg-slate-800 text-gray-300 
                       hover:bg-yellow-500 hover:text-black transition"
                >
                    Tất cả
                </button>
                {listcategory.map((cat, i) => (
                    <button
                        key={i}
                        className="px-4 py-1 rounded-full bg-slate-800 text-gray-300 
                       hover:bg-yellow-500 hover:text-black transition"
                    >
                        {cat.title}
                    </button>
                ))}
            </div>

            {/* Grid hiển thị sách */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {listBook.map((book) => (
                    <Link to={`/bookdetail/${book.slug}`}>
                        <div
                            key={book._id}
                            className="bg-slate-800 rounded-lg shadow-md overflow-hidden 
             transform transition duration-300 hover:scale-105 min-h-[320px]"
                        >

                            {/* Ảnh sách */}
                            <div className="relative">
                                <img
                                    src={book.image[0]}
                                    alt={book.title}
                                    className="w-full h-56 object-cover"
                                />
                                <button
                                    className="absolute top-2 right-2 bg-black/40 p-1 rounded-full"
                                >
                                    <button
                                        type="button"
                                        className="ml-2 flex-shrink-0 relative group"
                                    >
                                        {/* Trái tim viền xám */}
                                        <HeartOutline className="w-5 h-5 text-gray-300 group-hover:hidden transition-colors duration-200" />

                                        {/* Trái tim full đỏ (hiện khi hover) */}
                                        <LiaHeartSolid className="w-5 h-5 text-red-500 hidden group-hover:block transition-colors duration-200" />
                                    </button>
                                </button>
                            </div>

                            {/* Nội dung sách */}
                            <div className="p-3">
                                <p className="font-semibold text-sm line-clamp-2">{book.title}</p>
                                <p className="text-xs text-gray-400">{book.authors?.name || "Không rõ tác giả"}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] text-gray-400">readings</span>
                                    <span className="text-yellow-400 font-bold text-xs">1.2K+</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center items-center gap-3">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-yellow-500 hover:text-black transition"
                >
                    Previous
                </button>

                {/* Số trang */}
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1
                            ? "bg-yellow-500 text-black"
                            : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-yellow-500 hover:text-black transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
