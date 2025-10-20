import { useEffect, useState } from "react";
import { ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import type { Books } from "../../../../model/Books";
import APIBook from "../../api/book.api";

function BookDetail() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const [bookDetail, setBookDetail] = useState<Books | null>(null);

  // 🟡 Lấy token từ localStorage
  const token = localStorage.getItem("token");

  // 🟢 Gọi API lấy chi tiết sách
  useEffect(() => {
    if (!slug) return;
    fetch(`${APIBook.getBookDEtail}/${slug}`)
      .then((res) => res.json())
      .then((data) => setBookDetail(data))
      .catch((err) => console.log("Lỗi khi lấy chi tiết sách:", err));
  }, [slug]);

  console.log("📚 Book detail:", bookDetail);

  // 🟠 Hàm mượn sách
  const handleMuonSach = async (bookId?: string) => {
    if (!bookId) {
      alert("❌ Không tìm thấy mã sách!");
      return;
    }

    if (!token) {
      alert("⚠️ Bạn cần đăng nhập để mượn sách!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(APIBook.postBook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: bookId,
          quantityInput: quantity,
          slug: slug,
          language: "vn",
        }),
      });

      const data = await res.json();
      console.log("📦 Phản hồi từ server:", data);

      if (res.ok && data.url) {
        alert("✅ Mượn sách thành công! Hệ thống sẽ chuyển đến trang thanh toán VNPay.");
        window.location.href = data.url; // ✅ điều hướng tới trang thanh toán
      } else {
        alert(`❌ Lỗi: ${data.message || "Không thể mượn sách"}`);
      }
    } catch (err) {
      console.error("🚨 Lỗi khi gửi yêu cầu mượn sách:", err);
      alert("⚠️ Kết nối thất bại, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-slate-100 p-12 flex justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* overlay làm tối ảnh */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Nội dung */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-800/90 p-8 rounded-2xl shadow-xl">
          {/* Ảnh sách */}
          <div>
            <h1 className="text-3xl font-bold mb-10 text-center">📖 Chi Tiết Sách</h1>

            {bookDetail?.image?.[0] && (
              <img
                src={bookDetail.image[0]}
                alt="Book main"
                className="w-full h-96 rounded-xl mb-6 shadow-lg object-cover"
              />
            )}

            <div className="flex gap-4">
              {bookDetail?.image?.map((img, index) => (
                <div
                  key={index}
                  className="w-28 h-24 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform"
                >
                  <img src={img} alt={`Book ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin sách */}
          <div className="flex flex-col justify-start mt-20">
            <h2 className="text-4xl font-bold mb-4 text-yellow-400">{bookDetail?.title}</h2>
            <p className="text-slate-300 mb-6 text-lg leading-relaxed">
              {bookDetail?.decription}
            </p>

            <p className="text-xl font-medium mb-8">
              Giá:{" "}
              <span className="text-4xl font-extrabold text-yellow-400">
                {bookDetail?.price} ₫
              </span>
            </p>

            {/* Số lượng + Mượn */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 hover:scale-110 transition"
              >
                <Minus className="w-5 h-5" />
              </button>

              <span className="px-6 py-2 bg-slate-800 rounded-lg text-lg font-medium">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 hover:scale-110 transition"
              >
                <Plus className="w-5 h-5" />
              </button>

              <button
                disabled={loading}
                onClick={() => handleMuonSach(bookDetail?._id)}
                className={`ml-6 flex items-center gap-3 font-bold px-8 py-3 rounded-xl shadow-md transition
                  ${loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 text-slate-900 hover:bg-yellow-500 hover:scale-105"
                  }`}
              >
                {loading ? "Đang mượn..." : (
                  <>
                    <ShoppingCart className="w-6 h-6" /> Mượn Sách
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Đánh giá */}
        <div className="mt-16 bg-slate-800/90 p-8 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="flex items-center gap-1 text-yellow-400 text-2xl font-bold">
              5 <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </span>
            Đánh giá sản phẩm
          </h3>

          <div className="flex gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-slate-600"></div>

            <div className="flex-1">
              <p className="font-semibold text-lg">Tên user</p>
              <div className="flex items-center text-yellow-400 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${i <= 3 ? "fill-yellow-400" : "text-slate-500"}`}
                  />
                ))}
              </div>
              <p className="text-slate-300 text-base mb-2">
                Mô tả đánh giá: Sách khá hay nhưng hơi khó đọc.
              </p>
              <p className="text-sm text-slate-400">Phân loại: Bìa cứng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
