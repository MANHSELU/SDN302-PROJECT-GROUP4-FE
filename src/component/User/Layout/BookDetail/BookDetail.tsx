import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Minus,
  Plus,
  Star,
  MessageCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import type { Books } from "../../../../model/Books";
import type { Review } from "../../../../model/Review";
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
        alert(
          "✅ Mượn sách thành công! Hệ thống sẽ chuyển đến trang thanh toán VNPay."
        );
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
  // Review
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [reviewPageLoading, setReviewPageLoading] = useState(false);
  const [showReviewError, setShowReviewError] = useState(false);
  const [showLoginReviewError, setShowLoginReviewError] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  useEffect(() => {
    if (!bookDetail?._id) return;
    setReviewPageLoading(true);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(
      `${APIBook.getReview}?bookId=${bookDetail._id}&page=${page}&limit=5`,
      { headers }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setReviews(data.data);
          setTotalPages(data.totalPages || 1);
        } else {
          setReviews([]);
          setTotalPages(1);
        }
      })
      .catch((err) => console.log("Lỗi lấy review:", err))
      .finally(() => setReviewPageLoading(false));
  }, [bookDetail?._id, page, token]);

  const handleSendReview = async () => {
    if (rating === 0 || !reviewText.trim()) {
      setShowReviewError(true);
      setShowLoginReviewError(false);
      setShowReviewSuccess(false);
      return;
    }
    setShowReviewError(false);
    if (!token) {
      setShowLoginReviewError(true);
      setShowReviewSuccess(false);
      return;
    }
    setShowLoginReviewError(false);
    setReviewLoading(true);
    try {
      const res = await fetch(APIBook.addReview, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: bookDetail?._id,
          text: reviewText,
          rating: rating,
        }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setReviewText("");
        setRating(0);
        setPage(1);
        setShowReviewSuccess(true);
        setTimeout(() => setShowReviewSuccess(false), 2500);
        setReviewPageLoading(true);
        fetch(`${APIBook.getReview}?bookId=${bookDetail?._id}&page=1&limit=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data.data)) {
              setReviews(data.data);
              setTotalPages(data.totalPages || 1);
            } else {
              setReviews([]);
              setTotalPages(1);
            }
          })
          .catch((err) => console.log("Lỗi lấy review:", err))
          .finally(() => setReviewPageLoading(false));
      } else {
        alert(data.message || "Lỗi gửi đánh giá");
      }
    } catch {
      alert("Lỗi kết nối server!");
    } finally {
      setReviewLoading(false);
    }
  };
  return (
    <>
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat text-slate-100 p-12 flex justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-800/90 p-8 rounded-2xl shadow-xl">
            <div>
              <h1 className="text-3xl font-bold mb-10 text-center">
                📖 Chi Tiết Sách
              </h1>
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
                    <img
                      src={img}
                      alt={`Book ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-start mt-20">
              <h2 className="text-4xl font-bold mb-4 text-yellow-400">
                {bookDetail?.title}
              </h2>
              <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                {bookDetail?.decription}
              </p>
              <p className="text-xl font-medium mb-8">
                Giá:{" "}
                <span className="text-4xl font-extrabold text-yellow-400">
                  {bookDetail?.price} ₫
                </span>
              </p>
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
                    ${
                      loading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-yellow-400 text-slate-900 hover:bg-yellow-500 hover:scale-105"
                    }`}
                >
                  {loading ? (
                    "Đang mượn..."
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" /> Mượn Sách
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-16 bg-slate-800/90 p-8 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="flex items-center gap-1 text-yellow-400 text-2xl font-bold">
                Đánh giá sản phẩm
              </span>
            </h3>
            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    color={star <= rating ? "#FFD700" : "#888"}
                    fill={star <= rating ? "#FFD700" : "none"}
                    className="cursor-pointer"
                    onClick={() => {
                      setRating(star);
                      setShowReviewError(false);
                    }}
                  />
                ))}
              </div>
              <textarea
                className={`flex-1 p-3 rounded bg-slate-700 text-white ${
                  showReviewError ? "border-2 border-red-500" : ""
                }`}
                rows={2}
                placeholder="Viết đánh giá của bạn..."
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  setShowReviewError(false);
                }}
              />
              <button
                onClick={handleSendReview}
                disabled={reviewLoading}
                className={`px-6 py-2 rounded font-bold bg-yellow-400 text-slate-900 hover:bg-yellow-500 transition ${
                  reviewLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {reviewLoading ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
            {/* Hiển thị lỗi nhập thiếu hoặc chưa đăng nhập */}
            {(showReviewError || showLoginReviewError || showReviewSuccess) && (
              <div className="mb-4">
                {showReviewError && (
                  <p className="text-red-500 font-semibold">
                    Vui lòng nhập nội dung và chọn số sao đánh giá!
                  </p>
                )}
                {showLoginReviewError && (
                  <p className="text-red-500 font-semibold">
                    Bạn cần đăng nhập để đánh giá!
                  </p>
                )}
                {showReviewSuccess && (
                  <p className="text-green-500 font-semibold">
                    Đánh giá thành công!
                  </p>
                )}
              </div>
            )}

            {reviewPageLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <>
                {reviews.length === 0 && (
                  <p className="text-slate-400 italic">Chưa có đánh giá nào.</p>
                )}
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="flex gap-6 items-start bg-slate-900/70 rounded-xl p-5 shadow-md hover:shadow-lg transition"
                  >
                    <img
                      src={
                        r.user_id?.avatar && r.user_id.avatar !== "undefined"
                          ? r.user_id.avatar
                          : "/default-avatar.png"
                      }
                      alt="avatar"
                      className="w-12 h-12 rounded-full bg-slate-600 border-2 border-yellow-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-lg text-yellow-300">
                          {r.user_id?.fullname || "Người dùng"}
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-700 text-blue-400 hover:bg-slate-600 transition"
                            title="Reply"
                          >
                            <MessageCircle size={16} /> Reply
                          </button>
                          <button
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-700 text-green-400 hover:bg-slate-600 transition"
                            title="Edit"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-700 text-red-400 hover:bg-slate-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            color={star <= r.rating ? "#FFD700" : "#888"}
                            fill={star <= r.rating ? "#FFD700" : "none"}
                          />
                        ))}
                      </div>
                      <p className="text-slate-300 text-base mb-2">{r.text}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {totalPages > 1 && (
                  <div className="flex gap-2 justify-center mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <span className="px-4 py-1 font-bold text-yellow-400">
                      {page}/{totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default BookDetail;
