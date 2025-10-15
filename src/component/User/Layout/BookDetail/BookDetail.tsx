import { useState } from "react";
import { ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { useParams } from "react-router-dom";

function BookDetail() {
    const [quantity, setQuantity] = useState(1);
    const { slug } = useParams();
    console.log("slug là : ", slug);

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
                {/* Header */}


                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-800/90 p-8 rounded-2xl shadow-xl">
                    {/* Ảnh sách */}
                    <div>
                        <h1 className="text-3xl font-bold mb-10 text-center">📖 Chi Tiết Sách</h1>

                        <div className="w-full h-96 bg-slate-700 rounded-xl mb-6 shadow-lg"></div>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-28 h-24 bg-slate-700 rounded-lg shadow-md hover:scale-105 transition-transform"
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Thông tin sách */}
                    <div className="flex flex-col justify-start mt-20">
                        <h2 className="text-4xl font-bold mb-4 text-yellow-400">Tiêu đề Sách</h2>
                        <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                            Đây là mô tả ngắn về sách. Nội dung thú vị, hấp dẫn, và mang tính học
                            thuật cao.
                        </p>

                        <p className="text-xl font-medium mb-8">
                            Giá:{" "}
                            <span className="text-4xl font-extrabold text-yellow-400">
                                100.000.000 VND
                            </span>
                        </p>

                        {/* Số lượng + Mua */}
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

                            <button className="ml-6 flex items-center gap-3 bg-yellow-400 text-slate-900 font-bold px-8 py-3 rounded-xl shadow-md hover:bg-yellow-500 hover:scale-105 transition">
                                <ShoppingCart className="w-6 h-6" /> Mượn Sáchs
                            </button>
                        </div>
                    </div>
                </div>

                {/* Đánh giá */}
                <div className="mt-16 bg-slate-800/90 p-8 rounded-2xl shadow-xl" >
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-yellow-400 text-2xl font-bold">
                            5 <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </span>
                        Đánh giá sản phẩm
                    </h3>

                    <div className="flex gap-6 items-start">
                        {/* Avatar user */}
                        <div className="w-16 h-16 rounded-full bg-slate-600"></div>

                        {/* Nội dung đánh giá */}
                        <div className="flex-1">
                            <p className="font-semibold text-lg">Tên user</p>
                            <div className="flex items-center text-yellow-400 mb-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className={`w-6 h-6 ${i <= 3 ? "fill-yellow-400" : "text-slate-500"
                                            }`}
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
            </div >
        </div >
    );
}

export default BookDetail;
