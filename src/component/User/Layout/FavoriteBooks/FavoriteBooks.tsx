import { Heart, Trash2, Search, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import APIBook from "../../api/book.api";
import type { Books } from "../../../../model/Books";

function FavoriteBooks() {
  const [favoriteBooks, setFavoriteBooks] = useState<Books[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");

  // Lấy danh sách sách yêu thích từ BE
  const fetchFavouriteBooks = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(APIBook.getFavourite, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFavoriteBooks(data.data.map((fav: { book: Books }) => fav.book));
      })
      .catch(() => setFavoriteBooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavouriteBooks();
  }, [search]);

  // Hàm rút gọn mô tả theo số từ
  const truncateWords = (text: string, count: number) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= count) return text;
    return words.slice(0, count).join(" ") + "...";
  };

  // Lọc theo search
  const filteredBooks = favoriteBooks.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  //xóa khỏi danh sách yêu thích
  const handleRemoveFavourite = async (bookId?: string) => {
    if (!bookId) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    await fetch(APIBook.removeFavourite(bookId), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFavouriteBooks();
  };

  // Hàm hiển thị lại tất cả sách yêu thích
  const handleShowAllBooks = () => {
    setInputSearch("");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-red-500 w-9 h-9 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-white">Sách Yêu Thích</h1>
        </div>

        {/* Search + Filter + All Book */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex items-center bg-slate-800/80 px-4 py-2 rounded-lg w-full max-w-md shadow-md">
            <Search className="text-slate-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              className="bg-transparent outline-none flex-1 text-slate-200 placeholder:text-slate-400"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg transition shadow font-semibold"
            onClick={() => setSearch(inputSearch)}
          >
            Tìm kiếm
          </button>
          <button
            className="px-4 py-2 bg-slate-700 hover:bg-yellow-400 hover:text-slate-900 text-slate-200 rounded-lg transition shadow flex items-center gap-2 font-semibold"
            onClick={handleShowAllBooks}
          >
            <BookOpen className="w-5 h-5" />
            Tất cả
          </button>
        </div>

        {/* Danh sách sách yêu thích */}
        {loading ? (
          <p className="text-center text-gray-400">Đang tải dữ liệu...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBooks.length === 0 ? (
              <p className="text-center text-gray-400 col-span-2">
                Không có sách yêu thích nào.
              </p>
            ) : (
              filteredBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/bookdetail/${book.slug}`}
                  className="group"
                >
                  <div className="flex items-center gap-6 bg-slate-800/80 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition group">
                    {/* Ảnh sách */}
                    <img
                      src={book.image?.[0] || "/no-image.jpg"}
                      alt={book.title}
                      className="w-28 h-40 object-cover rounded-lg shadow-md group-hover:scale-105 transition"
                    />

                    {/* Thông tin */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1 group-hover:text-yellow-400 transition text-white">
                        {book.title}
                      </h2>
                      <p className="text-slate-400 text-sm mb-1">
                        <span className="font-medium text-slate-200">
                          Tác giả:
                        </span>{" "}
                        {book.authors?.name || "Không rõ tác giả"}
                      </p>
                      <p className="text-slate-400 text-sm mb-3">
                        {truncateWords(book.decription || "", 6)}
                      </p>
                      <p className="text-lg font-semibold text-yellow-400">
                        {book.price ? `${book.price} VND` : ""}
                      </p>
                    </div>

                    {/* Action */}
                    <button
                      className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium bg-red-500/10 px-4 py-2 rounded-lg transition"
                      onClick={(e) => {
                        e.preventDefault(); // Ngăn chuyển trang khi bấm nút xoá
                        handleRemoveFavourite(book._id);
                      }}
                    >
                      <Trash2 className="w-5 h-5" /> Xoá
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteBooks;
