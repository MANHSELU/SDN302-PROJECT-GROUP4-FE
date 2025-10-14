import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { useNavigate } from "react-router-dom";
import type { Books } from "../../../../model/Books";
import APIBookLibrarian from "../../api/book.api";
import type { Author } from "../../../../model/Author";
import type { Category } from "../../../../model/Category";

const SanphamList: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [isOpen, setIsOpen] = useState(false);
    const [sanphamlist, setSanphamlist] = useState<Books[]>([]);
    const [sortOrder, setSortOrder] = useState<string>("");
    const [hoatdong, setHoatdong] = useState<string>("");
    const [keySearch, setKeySearch] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    // tác giả và thể loại 
    const [authorList, setAuthorList] = useState<Author[]>([])
    const [categoryList, setCategoryList] = useState<Category[]>([])
    // gọi đến lấy dữ liệu của 
    useEffect(() => {
        if (!token) return; // nếu chưa đăng nhập thì không gọi API

        fetch(APIBookLibrarian.getCategory, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => setCategoryList(data.data))
            .catch((err) => console.error("Lỗi khi gọi danh sách thể loại:", err));
    }, [token]);
    console.log("thể loại là : ", categoryList)
    useEffect(() => {
        if (!token) return;

        fetch(APIBookLibrarian.getAuthor, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => setAuthorList(data.data))
            .catch((err) => console.error("Lỗi khi gọi danh sách tác giả:", err));
    }, [token]);
    console.log("tác giả là : ", authorList)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles]);
        }
    };
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 3) {
            setCurrentIndex((prev) => prev + 1);
        }
    };
    // ✅ Gọi API lấy danh sách sản phẩm
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            let url = APIBookLibrarian.getAllBook;
            const params: string[] = [];
            if (sortOrder) params.push(`sort=${sortOrder}`);
            if (hoatdong) params.push(`action=${hoatdong}`);
            if (keySearch.trim() !== "") params.push(`keyword=${encodeURIComponent(keySearch)}`);
            if (params.length > 0) url += `?${params.join("&")}`;

            console.log("Đường dẫn gọi API:", url);

            fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setSanphamlist(data))
                .catch((e) => console.log("Lỗi trong sản phẩm:", e));
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [sortOrder, hoatdong, keySearch, token]);
    console.log("sản phẩm là : ", sanphamlist)
    // ✅ Submit thêm mới sản phẩm

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("tittleInput", (document.getElementById("tittleInput") as HTMLInputElement).value);
        formData.append("quantityInput", (document.getElementById("quantityInput") as HTMLInputElement).value);
        formData.append("published_yearInput", (document.getElementById("published_yearInput") as HTMLInputElement).value);
        formData.append("categoryInput", (document.getElementById("categoryInput") as HTMLInputElement).value);
        formData.append("authorsInput", (document.getElementById("authorsInput") as HTMLInputElement).value);
        formData.append("shelfInput", (document.getElementById("shelfInput") as HTMLInputElement).value);
        formData.append("rowInput", (document.getElementById("rowInput") as HTMLInputElement).value);
        formData.append("columnInput", (document.getElementById("columnInput") as HTMLInputElement).value);
        formData.append("priceInput", (document.getElementById("priceInput") as HTMLInputElement).value);
        formData.append("descriptionInput", (document.getElementById("descriptionInput") as HTMLTextAreaElement).value);


        images.forEach((img) => {
            formData.append("images", img);
        })

        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        fetch(APIBookLibrarian.addBook, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => {
                if (res.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Thêm sản phẩm thành công!",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    setIsOpen(false);
                } else {
                    throw new Error(`HTTP status ${res.status}`);
                }
            })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Thêm sản phẩm thất bại!",
                    timer: 1500,
                    showConfirmButton: false,
                });
            });
    };

    // ✅ Đổi trạng thái hoạt động
    const handleChangeStatus = (id: string) => {
        fetch(`http://localhost:5001/admin/changeaction/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
                return res.json();
            })
            .then(() => {
                setSanphamlist((prev) =>
                    prev.map((b) =>
                        b._id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b
                    )
                );
            })
            .catch((err) => console.error("Đổi trạng thái thất bại:", err));
    };

    const handleSua = (id: string) => {
        navigate(`/admin/detailProduct/${id}`);
    };

    const handleXoa = async (id: string) => {

        try {
            const res = await fetch(`${APIBookLibrarian.deleteBook}/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Xóa sản phẩm thành công!",
                    timer: 1500,
                    showConfirmButton: false,
                });
                setSanphamlist((prev) => prev.filter((item) => item._id !== id));
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xóa thất bại!",
                    text: data.message,
                });
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                className="relative bg-transparent max-w-5xl w-full mx-auto rounded-2xl overflow-hidden shadow-2xl"
                overlayClassName="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
                {/* Nút đóng */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-5 right-6 text-gray-300 hover:text-white text-3xl font-bold transition"
                >
                    &times;
                </button>

                {/* Nền với overlay mờ */}
                <div className="bg-[url('https://copilot.microsoft.com/th/id/BCO.bc37d8a3-a52d-4231-9c04-93c5e7707375.png')] bg-cover bg-center relative">
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />

                    {/* Form thêm sách */}
                    <form
                        onSubmit={handleSubmit}
                        className="relative p-10 text-gray-100 rounded-2xl w-full z-10"
                    >
                        <h2 className="text-3xl font-bold mb-10 text-center text-teal-400 drop-shadow-md">
                            📚 Thêm Mới Sách
                        </h2>

                        {/* Upload + Inputs chính */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Khu upload ảnh */}
                            <div className="md:col-span-3 flex flex-col items-center">
                                <label
                                    className={`w-full ${images.length > 0 ? "h-[140px]" : "h-[200px]"
                                        } bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 flex items-center justify-center border-2 border-dashed border-gray-500 rounded-xl cursor-pointer transition-all duration-300`}
                                >
                                    <span className="text-4xl font-bold text-teal-400">+</span>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </label>

                                {/* Carousel mini */}
                                {images.length > 0 && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            disabled={currentIndex === 0}
                                            className="px-2 text-teal-400 hover:text-white disabled:opacity-30"
                                        >
                                            {"<"}
                                        </button>

                                        <div className="flex gap-2">
                                            {images.slice(currentIndex, currentIndex + 4).map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={URL.createObjectURL(img)}
                                                    alt={`preview-${i}`}
                                                    className="w-12 h-12 object-cover rounded-lg border border-gray-600 shadow-md"
                                                />
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={currentIndex >= images.length - 4}
                                            className="px-2 text-teal-400 hover:text-white disabled:opacity-30"
                                        >
                                            {">"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Inputs chính */}
                            <div className="md:col-span-9 grid grid-cols-2 gap-x-6 gap-y-5">
                                <input
                                    type="text"
                                    id="tittleInput"
                                    name="tittleInput"
                                    placeholder="📖 Tên sách"
                                    className="col-span-2 bg-gray-800/70 text-gray-100 placeholder-gray-400 h-12 px-4 
               rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 
               outline-none transition-all duration-200"
                                />

                                <input
                                    type="number"
                                    id="quantityInput"
                                    name="quantityInput"
                                    placeholder="📦 Số lượng"
                                    className="bg-gray-800/70 text-gray-100 placeholder-gray-400 h-12 px-4 
               rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 
               outline-none transition-all duration-200"
                                />

                                <input
                                    type="text"
                                    id="published_yearInput"
                                    name="published_yearInput"
                                    placeholder="📅 Năm xuất bản"
                                    className="bg-gray-800/70 text-gray-100 placeholder-gray-400 h-12 px-4 
               rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 
               outline-none transition-all duration-200"
                                />

                                <select
                                    id="categoryInput"
                                    name="categoryInput"
                                    className="bg-gray-800/70 text-white h-12 px-4 rounded-lg border border-gray-700 
             focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200"
                                    defaultValue=""
                                >
                                    <option value="" disabled style={{ color: "#aaa" }}>
                                        🏷️ Chọn thể loại
                                    </option>
                                    {categoryList.map((cat) => (
                                        <option
                                            key={cat._id}
                                            value={cat._id}
                                            style={{ backgroundColor: "#1f2937", color: "white" }} // ép màu cho option
                                        >
                                            {cat.title ?? cat.title}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    id="authorsInput"
                                    name="authorsInput"
                                    className="bg-gray-800/70 text-white h-12 px-4 rounded-lg border border-gray-700 
             focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-200"
                                    defaultValue=""
                                >
                                    <option value="" disabled style={{ color: "#aaa" }}>
                                        ✍️ Chọn tác giả
                                    </option>
                                    {authorList.map((author) => (
                                        <option
                                            key={author._id}
                                            value={author._id}
                                            style={{ backgroundColor: "#1f2937", color: "white" }}
                                        >
                                            {author.name}
                                        </option>
                                    ))}
                                </select>


                            </div>

                        </div>

                        {/* Field phụ */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                            <input
                                type="text"
                                id="shelfInput"
                                name="shelfInput"
                                placeholder="🗄️ Kệ"
                                className="bg-gray-800/70 text-gray-100 placeholder-gray-400 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <input
                                type="text"
                                id="rowInput"
                                name="rowInput"
                                placeholder="📚 Hàng"
                                className="bg-gray-800/70 text-gray-100 placeholder-gray-400 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <input
                                type="text"
                                id="columnInput"
                                name="columnInput"
                                placeholder="🧩 Cột"
                                className="bg-gray-800/70 text-gray-100 placeholder-gray-400 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <input
                                type="number"
                                id="priceInput"
                                name="priceInput"
                                placeholder="💰 Giá"
                                className="bg-gray-800/70 text-gray-100 placeholder-gray-400 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        <textarea
                            id="descriptionInput"
                            name="descriptionInput"
                            placeholder="📝 Mô tả sách"
                            className="bg-gray-800/70 text-gray-100 placeholder-gray-400 w-full h-40 p-4 mt-10 rounded-lg border border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                        />

                        {/* Nút hành động */}
                        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                            >
                                ❌ Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-400 text-gray-900 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all duration-200"
                            >
                                💾 Lưu Sách
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Danh sách sản phẩm */}
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý sách </h1>
                <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            🔎 Bộ lọc & Tìm kiếm
                        </h2>

                        {/* Nút reset filter (tùy chọn) */}
                        <button
                            onClick={() => {
                                setKeySearch("");
                                setSortOrder("");
                                setHoatdong("");
                            }}
                            className="text-sm text-gray-600 hover:text-blue-600 transition"
                        >
                            Đặt lại
                        </button>
                    </div>

                    {/* Nội dung bộ lọc */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Ô tìm kiếm */}
                        <div className="col-span-2">
                            <form
                                id="form-search"
                                className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="text"
                                    placeholder="Nhập từ khóa sản phẩm, tiêu đề..."
                                    name="keyword"
                                    className="flex-1 px-4 py-2 text-gray-700 focus:outline-none placeholder-gray-400"
                                    value={keySearch}
                                    onChange={(e) => setKeySearch(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold transition"
                                >
                                    Tìm
                                </button>
                            </form>
                        </div>

                        {/* Bộ lọc trạng thái (ví dụ) */}
                        <div className="flex gap-3">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
                            >
                                <option value="">Lọc theo giá</option>
                                <option value="asc">Giá tăng dần</option>
                                <option value="desc">Giá giảm dần</option>
                            </select>

                            <select
                                value={hoatdong}
                                onChange={(e) => setHoatdong(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
                            >
                                <option value="">Trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Ngưng bán</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <button
                        onClick={() => setIsOpen(true)}
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
                        Thêm mới
                    </button>
                </div>

                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-3">STT</th>
                                <th className="p-3 text-left">Tiêu đề</th>
                                <th className="p-3 text-left">Mô tả</th>
                                <th className="p-3 text-left">Giá</th>
                                <th className="p-3 text-left">Tác giả</th>
                                <th className="p-3 text-left">Ảnh</th>
                                <th className="p-3 text-left">Trạng thái</th>
                                <th className="p-3 text-left">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {sanphamlist.map((item, idx) => (
                                <tr key={item._id} className="border-b hover:bg-gray-100">
                                    <td className="p-3">{idx + 1}</td>
                                    <td className="p-3">{item.title}</td>
                                    <td className="p-3 text-gray-700">
                                        {item.decription
                                            ? item.decription.length > 6
                                                ? item.decription.substring(0, 20) + "..."
                                                : item.decription
                                            : "—"}
                                    </td>

                                    <td className="p-3 text-green-600">
                                        {item.price ? `${item.price.toLocaleString()} ₫` : "—"}
                                    </td>
                                    <td className="p-3">{item.authors?.name}</td>
                                    <td className="p-3">
                                        {item.image && item.image.length > 0 ? (
                                            <img
                                                src={item.image[0]}
                                                alt={item.title}
                                                className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
                                            />
                                        ) : (
                                            <span className="text-gray-400 italic">Không có ảnh</span>
                                        )}
                                    </td>


                                    <td className="p-3">
                                        <button
                                            className={`px-3 py-1 rounded ${item.status === "active"
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                                }`}
                                            onClick={() => handleChangeStatus(item._id ?? "")}
                                        >
                                            {item.status === "active" ? "Hoạt động" : "Ngưng bán"}
                                        </button>
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => handleSua(item._id ?? "")}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleXoa(item._id ?? "")}
                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default SanphamList;
