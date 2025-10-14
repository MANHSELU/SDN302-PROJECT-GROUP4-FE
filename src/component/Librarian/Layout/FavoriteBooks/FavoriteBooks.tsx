import { Heart, Trash2, Search } from "lucide-react";

function FavoriteBooks() {
    const favoriteBooks = [
        {
            id: 1,
            title: "Clean Code",
            author: "Robert C. Martin",
            description: "A handbook of agile software craftsmanship.",
            price: "350.000 VND",
            image:
                "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482780sAH/anh-mo-ta.png",
        },
        {
            id: 2,
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt, David Thomas",
            description: "Journey to Mastery.",
            price: "420.000 VND",
            image: "https://via.placeholder.com/120x160",
        },
        {
            id: 3,
            title: "Refactoring",
            author: "Martin Fowler",
            description: "Improving the design of existing code.",
            price: "500.000 VND",
            image: "https://via.placeholder.com/120x160",
        },
    ];

    // Hàm rút gọn mô tả theo số từ
    const truncateWords = (text: string, count: number) => {
        const words = text.split(" ");
        if (words.length <= count) return text;
        return words.slice(0, count).join(" ") + "...";
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Heart className="text-red-500 w-9 h-9 animate-pulse" />
                <h1 className="text-3xl font-extrabold">Sách Yêu Thích</h1>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-4 mb-10">
                {/* Search box */}
                <div className="flex items-center bg-slate-800 px-4 py-2 rounded-lg w-full max-w-md shadow-md">
                    <Search className="text-slate-400 w-5 h-5 mr-2" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách..."
                        className="bg-transparent outline-none flex-1 text-slate-200 placeholder:text-slate-400"
                    />
                </div>

                {/* Filter buttons */}
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-yellow-400 hover:text-slate-900 text-slate-200 rounded-lg transition shadow">
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Danh sách sách yêu thích */}
            <div className="flex flex-col gap-6">
                {favoriteBooks.map((book) => (
                    <div
                        key={book.id}
                        className="flex items-center gap-6 bg-slate-800/80 p-6 rounded-2xl shadow-lg hover:shadow-xl transition group"
                    >
                        {/* Ảnh sách */}
                        <img
                            src={book.image}
                            alt={book.title}
                            className="w-28 h-40 object-cover rounded-lg shadow-md group-hover:scale-105 transition"
                        />

                        {/* Thông tin */}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-1 group-hover:text-yellow-400 transition">
                                {book.title}
                            </h2>
                            <p className="text-slate-400 text-sm mb-1">
                                <span className="font-medium text-slate-200">Tác giả:</span>{" "}
                                {book.author}
                            </p>
                            <p className="text-slate-400 text-sm mb-3">
                                {truncateWords(book.description, 6)}
                            </p>
                            <p className="text-lg font-semibold text-yellow-400">
                                {book.price}
                            </p>
                        </div>

                        {/* Action */}
                        <button className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium bg-red-500/10 px-4 py-2 rounded-lg transition">
                            <Trash2 className="w-5 h-5" /> Xoá
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FavoriteBooks;
