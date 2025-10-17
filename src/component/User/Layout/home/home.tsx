import { Layers } from "lucide-react";
import "./home.css";
import { useEffect, useState } from "react";
import type { Books } from "../../../../model/Books";
import APIBook from "../../api/book.api";
import type { Category } from "../../../../model/Category";
import type { Author } from "../../../../model/Author";
import APIAuthor from "../../api/author.api";
import { Star } from "lucide-react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const LibraryDashboard = () => {
  const [listBook, setListBook] = useState<Books[]>([]);
  useEffect(() => {
    fetch(APIBook.getBook)
      .then((res) => res.json())
      .then((data) => setListBook(data.data))
      .catch((err) =>
        console.log("lỗi trong khi gọi danh sách book là : ", err)
      );
  }, []);
  const [categorylimit, setCategoryLimit] = useState<Category[]>([]);
  useEffect(() => {
    fetch(APIBook.getCategorylimit)
      .then((res) => res.json())
      .then((data) => setCategoryLimit(data.data))
      .catch((err) =>
        console.log("lỗi trong khi gọi danh sách book là : ", err)
      );
  }, []);
  const [newBook, setnewBook] = useState<Books[]>([]);
  useEffect(() => {
    fetch(APIBook.getNewBook)
      .then((res) => res.json())
      .then((data) => setnewBook(data.data))
      .catch((err) =>
        console.log("lỗi trong khi gọi danh sách book là : ", err)
      );
  }, []);
  const [listAuthor, setListAuthor] = useState<Author[]>([]);
  useEffect(() => {
    fetch(APIAuthor.getAthour)
      .then((res) => res.json())
      .then((data) => setListAuthor(data.data))
      .catch((err) => console.log("lỗi trong chương trình là : ", err));
  }, []);
  const authors = [
    {
      src: "https://giaydabongtot.com/wp-content/uploads/2020/10/Hinh-nen-ronaldo-cr7-may-tinh-laptop-3-scaled.jpg",
      name: "Author 1",
      description: "Nhà văn nổi tiếng với các tác phẩm kinh điển.",
    },
    {
      src: "https://giaydabongtot.com/wp-content/uploads/2020/10/Hinh-nen-ronaldo-cr7-may-tinh-laptop-3-scaled.jpg",
      name: "Author 2",
      description: "Tác giả chuyên viết sách khoa học và giáo dục.",
    },
    {
      src: "https://giaydabongtot.com/wp-content/uploads/2020/10/Hinh-nen-ronaldo-cr7-may-tinh-laptop-3-scaled.jpg",
      name: "Author 3",
      description: "Được biết đến qua tiểu thuyết lịch sử nổi tiếng.",
    },
    {
      src: "https://giaydabongtot.com/wp-content/uploads/2020/10/Hinh-nen-ronaldo-cr7-may-tinh-laptop-3-scaled.jpg",
      name: "Author 4",
      description: "Chuyên gia trong lĩnh vực văn học thiếu nhi.",
    },
    {
      src: "https://giaydabongtot.com/wp-content/uploads/2020/10/Hinh-nen-ronaldo-cr7-may-tinh-laptop-3-scaled.jpg",
      name: "Author 5",
      description: "Được yêu thích với các tác phẩm thơ ca lãng mạn.",
    },
    {
      src: "https://giaydabongtot.com/wp-content/uploads/2020/10/Hinh-nen-ronaldo-cr7-may-tinh-laptop-3-scaled.jpg",
      name: "Author 6",
      description: "Tác giả chuyên nghiên cứu và viết về triết học.",
    },
    {
      src: "https://giaydabongtot.com/wp-content/uploads/2020/10/Hinh-nen-ronaldo-cr7-may-tinh-laptop-3-scaled.jpg",
      name: "Author 7",
      description: "Nhà văn hiện đại với phong cách sáng tạo mới mẻ.",
    },
  ];
  const totalReviews = 1315;
  const ratings = [
    { stars: 5, percent: 75, count: 982, color: "bg-green-500" },
    { stars: 4, percent: 16, count: 205, color: "bg-green-400" },
    { stars: 3, percent: 5, count: 65, color: "bg-yellow-400" },
    { stars: 2, percent: 1, count: 17, color: "bg-orange-400" },
    { stars: 1, percent: 3, count: 46, color: "bg-red-500" },
  ];

  // --- YÊU THÍCH ---
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

  // Thêm vào yêu thích
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

  // Xóa khỏi yêu thích
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

  return (
    <>
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left content 70% */}
        <div className="col-span-12 lg:col-span-8 space-y-8 px-4">
          {/* Previous Reading */}
          <section>
            <h1 className="text-xl font-semibold mb-4">Previous Reading</h1>
            <div className="carousel">
              <div className="image-container flex gap-4">
                {/* lần 1 */}
                {listBook.map((book, i) => (
                  <div
                    key={i}
                    className="book-card transform transition duration-300 hover:scale-105 bg-slate-900 text-white p-4 rounded-lg shadow-lg relative w-48"
                  >
                    {/* Ảnh sách */}
                    <img
                      src={book.image[0]}
                      alt={book.title}
                      style={{
                        width: "150px",
                        height: "170px",
                        objectFit: "cover",
                      }}
                      className="rounded-md mb-3"
                    />

                    {/* Tiêu đề + Icon trái tim */}
                    <div
                      className="flex justify-between items-start"
                      style={{ width: "150px" }}
                    >
                      <p className="font-medium text-xs leading-snug break-words w-4/5 line-clamp-2">
                        {book.title}
                      </p>
                      <button
                        type="button"
                        className="ml-2 flex-shrink-0 relative group"
                        onClick={() =>
                          favouriteIds.includes(book._id ?? "")
                            ? handleRemoveFavourite(book._id ?? "")
                            : handleAddFavourite(book._id ?? "")
                        }
                        title={
                          favouriteIds.includes(book._id ?? "")
                            ? "Xóa khỏi yêu thích"
                            : "Thêm vào yêu thích"
                        }
                      >
                        {favouriteIds.includes(book._id ?? "") ? (
                          <HeartSolid className="w-5 h-5 text-red-500 transition-colors duration-200" />
                        ) : (
                          <>
                            <HeartOutline className="w-5 h-5 text-gray-300 group-hover:hidden transition-colors duration-200" />
                            <HeartSolid className="w-5 h-5 text-red-500 hidden group-hover:block transition-colors duration-200" />
                          </>
                        )}
                      </button>
                    </div>
                    <p
                      className="text-[10px] text-gray-400 text-right"
                      style={{ paddingRight: "10px", paddingTop: "3px" }}
                    >
                      readings
                    </p>

                    {/* Tác giả + Lượt đọc */}
                    <div className="flex justify-between items-center mt-2 mx-4">
                      <p className="text-[10px] text-gray-400">
                        {book?.authors?.name || "không rõ tác giả "}
                      </p>
                      <p className="text-yellow-400 font-bold text-xs">1.2+</p>
                    </div>
                  </div>
                ))}

                {/* lần 2 (nối đuôi để không giật) */}
                {listBook.map((book, i) => (
                  <div
                    key={`dup-${i}`}
                    className="book-card transform transition duration-300 hover:scale-110 bg-slate-900 text-white p-4 rounded-lg shadow-lg relative w-48"
                  >
                    <img
                      src={book.image[0]}
                      alt={book.title}
                      style={{
                        width: "150px",
                        height: "170px",
                        objectFit: "cover",
                      }}
                      className="rounded-md mb-3"
                    />

                    <div className="flex justify-between items-start">
                      <p className="font-medium text-xs leading-snug break-words w-4/5 line-clamp-2">
                        {book.title}
                      </p>
                      <button
                        type="button"
                        className="ml-2 flex-shrink-0 relative group"
                        onClick={() =>
                          favouriteIds.includes(book._id ?? "")
                            ? handleRemoveFavourite(book._id ?? "")
                            : handleAddFavourite(book._id ?? "")
                        }
                        title={
                          favouriteIds.includes(book._id ?? "")
                            ? "Xóa khỏi yêu thích"
                            : "Thêm vào yêu thích"
                        }
                      >
                        {favouriteIds.includes(book._id ?? "") ? (
                          <HeartSolid className="w-5 h-5 text-red-500 transition-colors duration-200" />
                        ) : (
                          <>
                            <HeartOutline className="w-5 h-5 text-gray-300 group-hover:hidden transition-colors duration-200" />
                            <HeartSolid className="w-5 h-5 text-red-500 hidden group-hover:block transition-colors duration-200" />
                          </>
                        )}
                      </button>
                    </div>
                    <p
                      className="text-[10px] text-gray-400 text-right"
                      style={{ paddingRight: "10px", paddingTop: "3px" }}
                    >
                      readings
                    </p>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] text-gray-400">
                        {book?.authors?.name || "không rõ tác giả "}
                      </p>
                      <p className="text-yellow-400 font-bold text-xs">1.2+</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Subjects */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Subjects section</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categorylimit.slice(0, 6).map((s, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-lg p-4 flex flex-col items-center justify-center w-90 h-25"
                >
                  <Layers className="h-6 w-6 mb-2 text-yellow-400" />
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-sm text-slate-400">1.2k books</div>
                </div>
              ))}
            </div>
          </section>

          {/* New Books */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New books</h2>
              <a href="#" className="text-sm text-yellow-400">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {newBook.map((books, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-lg overflow-hidden w-36 h-50 
                   transform transition duration-300 hover:scale-110"
                >
                  <img
                    src={books.image[0]}
                    alt={books.title}
                    className="w-full h-32 object-cover"
                  />
                  <div
                    className="flex justify-between items-start mt-2 px-2"
                    style={{ width: "150px" }}
                  >
                    <p className="font-medium text-xs leading-snug break-words w-4/5 line-clamp-2 mx-2">
                      {books.title}
                    </p>
                    <button
                      type="button"
                      className="ml-2 flex-shrink-0 relative group"
                      onClick={() =>
                        favouriteIds.includes(books._id ?? "")
                          ? handleRemoveFavourite(books._id ?? "")
                          : handleAddFavourite(books._id ?? "")
                      }
                      title={
                        favouriteIds.includes(books._id ?? "")
                          ? "Xóa khỏi yêu thích"
                          : "Thêm vào yêu thích"
                      }
                    >
                      {favouriteIds.includes(books._id ?? "") ? (
                        <HeartSolid className="w-5 h-5 text-red-500 transition-colors duration-200" />
                      ) : (
                        <>
                          <HeartOutline className="w-5 h-5 text-gray-300 group-hover:hidden transition-colors duration-200" />
                          <HeartSolid className="w-5 h-5 text-red-500 hidden group-hover:block transition-colors duration-200" />
                        </>
                      )}
                    </button>
                  </div>
                  <p
                    className="text-[10px] text-gray-400 text-right"
                    style={{ paddingRight: "10px", paddingTop: "3px" }}
                  >
                    readings
                  </p>

                  <div className="flex justify-between items-center mt-2 mx-4 mb-2">
                    <p className="text-[10px] text-gray-400">
                      {books?.authors?.name || "không rõ tác giả "}
                    </p>
                    <p className="text-yellow-400 font-bold text-xs">1.2+</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right content 30% */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Popular Books */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Popular books</h2>
              <a href="#" className="text-sm text-yellow-400">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-lg overflow-hidden w-28 h-32"
                >
                  <img
                    src={`https://picsum.photos/seed/pop${i}/200/250`}
                    alt={`Popular Book ${i + 1}`}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-2 text-xs text-center truncate">
                    Popular Book {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Writers */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Writers and Authors</h2>
              <a href="#" className="text-sm text-yellow-400">
                Show all
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {listAuthor.slice(0, 6).map((a, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-lg p-4 flex items-center gap-3"
                >
                  <img
                    src={`https://i.pravatar.cc/40?img=${i + 5}`}
                    className="h-10 w-10 rounded-full"
                    alt={a.name}
                  />
                  <div>
                    <div className="font-semibold" style={{ fontSize: "15px" }}>
                      {a.name}
                    </div>
                    <div className="text-xs text-slate-400">756 books</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <section className="py-16 px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white-800 leading-snug">
          Từ niềm đam mê đọc sách <br /> đến không gian tri thức chung
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Text box */}
          <div className="p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200 bg-white">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Library ra đời từ tình yêu tri thức
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Chúng tôi hiểu cảm giác bối rối khi đứng trước hàng ngàn cuốn sách
              mà không biết nên bắt đầu từ đâu. <br />
              <br />
              Chúng tôi từng tìm kiếm những cuốn sách phù hợp với sở thích, mục
              tiêu học tập hay đơn giản chỉ để thư giãn, nhưng lại bỏ cuộc vì
              thiếu gợi ý rõ ràng hoặc không gian đọc chưa thật sự thoải mái.{" "}
              <br />
              <br />
              <span className="font-medium text-gray-900 italic">
                "Tại sao không có một thư viện vừa hiện đại, thân thiện, vừa
                mang đến trải nghiệm cá nhân hóa cho mỗi độc giả?"
              </span>
            </p>
          </div>

          {/* Image box */}
          <div className="w-full h-[320px] md:h-[420px]">
            <img
              src="https://cdn.thuviennhadat.vn//upload/hinh-anh-bai-viet/NHN/Thang-02-2025/12-02/lawnet/08-loai-hinh-thu-vien-theo-phap-luat-viet-nam.jpg"
              alt="Thư viện hiện đại"
              className="rounded-2xl shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-10 px-6 py-12 bg-slate-900">
        {/* Quote */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold italic text-slate-100">
            “Một thư viện không chỉ cho bạn sách, mà còn mở ra cả thế giới trong
            tâm trí bạn.”
          </h2>
          <p className="text-slate-400 mt-4">
            Thư viện không chỉ là nơi chứa sách, mà là cánh cửa mở ra tri thức.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {authors.slice(0, 4).map((author, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:shadow-yellow-400/20 transition"
              >
                <img
                  src={author.src}
                  alt={author.name}
                  className="rounded-lg w-full h-56 object-cover mb-5"
                />
                <h3 className="text-slate-100 font-semibold text-xl">
                  {author.name}
                </h3>
                <p className="text-slate-400 text-base mt-3">
                  {author.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-14 px-8 bg-slate-900">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Đánh giá chúng tôi
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-14 max-w-5xl mx-auto">
          {/* Left: Overall rating */}
          <div className="text-center md:text-left">
            <p className="text-6xl font-bold text-green-400">4.7</p>
            <div className="flex items-center justify-center md:justify-start mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={28}
                  className={`${
                    i < 4 ? "fill-green-400 text-green-400" : "text-slate-600"
                  }`}
                />
              ))}
              <span className="ml-3 text-slate-300 text-lg">
                {totalReviews} reviews
              </span>
            </div>
            <p className="text-slate-500 mt-3 text-base">
              {totalReviews} đánh giá
            </p>
          </div>

          {/* Right: Breakdown */}
          <div className="flex-1 w-full space-y-4">
            {ratings.map((r) => (
              <div key={r.stars} className="flex items-center gap-5">
                <span className="w-4 text-base font-medium text-slate-200">
                  {r.stars}
                </span>
                <div className="flex-1 bg-slate-700 h-4 rounded-full">
                  <div
                    className={`${r.color} h-4 rounded-full`}
                    style={{ width: `${r.percent}%` }}
                  ></div>
                </div>
                <span className="w-14 text-base text-slate-300">
                  {r.percent}%
                </span>
                <span className="w-14 text-base text-slate-300">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LibraryDashboard;
