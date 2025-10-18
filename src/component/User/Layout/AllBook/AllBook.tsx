import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { Category } from "../../../../model/Category";
import APIBook from "../../api/book.api";
import type { Books } from "../../../../model/Books";
import { LiaHeartSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

export default function AllBooks() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [listBook, setListBook] = useState<Books[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Favourite
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(APIBook.getFavourite, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFavouriteIds(
          data.data.map((f: { book: Books }) => f.book._id ?? "")
        );
      })
      .catch(() => setFavouriteIds([]));
  }, []);
  //add khi nhan vao tim
  const handleAddFavourite = async (bookId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      if (favouriteIds.includes(bookId)) return;
      const res = await fetch(APIBook.addFavourite, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });
      if (res.ok) {
        setFavouriteIds((prev) => [...prev, bookId]);
      }
    } catch (e) {
      console.error("Add favourite error:", e);
    }
  };
  //delete khi nhan lai vao tim
  const handleRemoveFavourite = async (bookId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(APIBook.removeFavourite(bookId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setFavouriteIds((prev) => prev.filter((id) => id !== bookId));
      }
    } catch (e) {
      console.error("Remove favourite error:", e);
    }
  };

  // Lấy danh mục
  useEffect(() => {
    fetch(APIBook.getCategorylimit)
      .then((res) => res.json())
      .then((data) => setListCategory(data.data || []))
      .catch((err) => console.error("❌ Lỗi khi gọi danh sách category:", err));
  }, []);

  // Lấy danh sách sách theo trang + category
  useEffect(() => {
    setLoading(true);
    const url = `${APIBook.getBook}?page=${currentPage}${
      search ? `&keyword=${encodeURIComponent(search)}` : ""
    }${
      selectedCategory
        ? `&categoryTitle=${encodeURIComponent(selectedCategory)}`
        : ""
    }`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setListBook(data.data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.error("❌ Lỗi khi lấy danh sách book:", err))
      .finally(() => setLoading(false));
  }, [currentPage, search, selectedCategory]);

  const FindSEarch = () => {
    setSearch(inputSearch);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Tất cả sách</h1>

      {/* Thanh tìm kiếm */}
      <div className="relative mb-6 max-w-lg flex">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            className="w-full px-4 py-2 pl-10 rounded-l-lg bg-slate-800 text-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />
          <button className="absolute left-3 top-2.5 text-gray-400">🔍</button>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2 
                   bg-gradient-to-r from-yellow-400 to-yellow-500 
                   text-black font-semibold shadow-md
                   hover:from-yellow-500 hover:to-yellow-600 
                   hover:scale-105 transition-all duration-200"
          onClick={FindSEarch}
        >
          <span>🔍</span>
          <span>Tìm</span>
        </button>
      </div>

      {/* Bộ lọc danh mục */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => {
            setSelectedCategory("");
            setCurrentPage(1);
          }}
          className={`px-4 py-1 rounded-full transition ${
            selectedCategory === ""
              ? "bg-yellow-500 text-black"
              : "bg-slate-800 text-gray-300 hover:bg-yellow-500 hover:text-black"
          }`}
        >
          Tất cả
        </button>
        {listCategory.map((cat) => (
          <button
            key={cat._id}
            onClick={() => {
              setSelectedCategory(cat.title);
              setCurrentPage(1);
            }}
            className={`px-4 py-1 rounded-full transition ${
              selectedCategory === cat.title
                ? "bg-yellow-500 text-black"
                : "bg-slate-800 text-gray-300 hover:bg-yellow-500 hover:text-black"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Hiển thị loading */}
      {loading ? (
        <p className="text-center text-gray-400">Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Grid hiển thị sách */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {listBook.map((book) => (
              <Link key={book._id} to={`/bookdetail/${book.slug}`}>
                <div
                  className="bg-slate-800 rounded-lg shadow-md overflow-hidden 
                             transform transition duration-300 hover:scale-105 min-h-[320px]"
                >
                  {/* Ảnh sách */}
                  <div className="relative">
                    <img
                      src={book.image?.[0] || "/no-image.jpg"}
                      alt={book.title}
                      className="w-full h-56 object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-black/40 p-1 rounded-full flex items-center justify-center group"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (favouriteIds.includes(book._id ?? "")) {
                          handleRemoveFavourite(book._id ?? "");
                        } else {
                          handleAddFavourite(book._id ?? "");
                        }
                      }}
                      title={
                        favouriteIds.includes(book._id ?? "")
                          ? "Xóa khỏi yêu thích"
                          : "Thêm vào yêu thích"
                      }
                      aria-label={
                        favouriteIds.includes(book._id ?? "")
                          ? "Xóa khỏi yêu thích"
                          : "Thêm vào yêu thích"
                      }
                    >
                      {favouriteIds.includes(book._id ?? "") ? (
                        <LiaHeartSolid className="w-5 h-5 text-red-500 transition-colors duration-200" />
                      ) : (
                        <>
                          <HeartOutline className="w-5 h-5 text-gray-300 group-hover:hidden transition-colors duration-200" />
                          <LiaHeartSolid className="w-5 h-5 text-red-500 hidden group-hover:block transition-colors duration-200" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Nội dung sách */}
                  <div className="p-3">
                    <p className="font-semibold text-sm line-clamp-2">
                      {book.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {book.authors?.name || "Không rõ tác giả"}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-400">
                        readings
                      </span>
                      <span className="text-yellow-400 font-bold text-xs">
                        1.2K+
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-yellow-500 hover:text-black transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-yellow-500 text-black"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-yellow-500 hover:text-black transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
