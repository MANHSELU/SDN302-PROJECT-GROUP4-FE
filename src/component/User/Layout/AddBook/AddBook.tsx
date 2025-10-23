import { useState } from "react";
import categories from "../../../../data/Library_System.categorys.json";
import Authors from "../../../../data/Library_System.authors.json";
function AddBookForm() {
  const [images, setImages] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  // State cho chatbox
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  const [authors, setAuthors] = useState("");

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

  // Gửi tin nhắn
  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("tittleInput",(document.getElementById("title") as HTMLInputElement).value);
    formData.append("quantityInput",(document.getElementById("quantity") as HTMLInputElement).value);
    formData.append("published_yearInput",(document.getElementById("published-year") as HTMLInputElement).value);
     formData.append("categoryInput", category);
  formData.append("authorsInput", authors);
    formData.append("shelfInput",(document.getElementById("shelf") as HTMLInputElement).value);
    formData.append("rowInput",(document.getElementById("row") as HTMLInputElement).value);
    formData.append("columnInput",(document.getElementById("column") as HTMLInputElement).value);
    formData.append("priceInput",(document.getElementById("price") as HTMLInputElement).value);
    formData.append("descriptionInput",(document.getElementById("description") as HTMLInputElement).value);
    
    images.forEach((img)=>{
      formData.append("images",img);
    })

    try {
      const res = await fetch(`${import.meta.env.VITE_APIPORT}/api/librarian/check/addNewBooks`, {

        method : "POST",
        body : formData,
      });
        const data = await res.json();
    if (res.ok) {
      alert("✅ Thêm sách thành công"); // lấy message từ BE luôn
      console.log(data);
    } else {
      alert("❌ Thêm sách thất bại ");
    }
    } catch (err) {
       console.error("Error:", err);
    alert("Không thể kết nối server");
    }finally {
    setLoading(false); // ✅ luôn tắt loading dù thành công hay thất bại
  }
  };


  return (
    <div className="min-h-screen bg-[url('https://copilot.microsoft.com/th/id/BCO.bc37d8a3-a52d-4231-9c04-93c5e7707375.png')] bg-cover bg-center flex items-center relative">
      {/* Form thêm sách */}
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-slate-800/70 shadow-xl text-gray-800 rounded-2xl w-11/12 md:w-3/4 lg:w-2/3 mx-auto mt-20"
      >
        <h2 className="text-gray-400 text-3xl font-bold mb-8 text-center">
          📚 Thêm Mới Sách
        </h2>

        {/* Upload ảnh + Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3 flex flex-col items-center">
            {/* Ô upload */}
            <label
              className={`w-full ${
                images.length > 0 ? "h-[140px]" : "h-[200px]"
              } bg-gray-400 flex items-center justify-center text-gray-500 border-gray-800 rounded-xl border-2 border-solid cursor-pointer hover:bg-gray-600 transition`}
            >
              <span className="text-gray-600 text-4xl">+</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>

            {/* Carousel nhỏ khi có ảnh */}
            {images.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-2 text-gray-600 hover:text-black disabled:opacity-30"
                >
                  {"<"}
                </button>

                <div className="flex gap-2">
                  {images
                    .slice(currentIndex, currentIndex + 4)
                    .map((img, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(img)}
                        alt={`preview-${i}`}
                        className="w-11 h-12 object-cover rounded-lg border"
                      />
                    ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex >= images.length - 4}
                  className="px-2 text-gray-600 hover:text-black disabled:opacity-30"
                >
                  {">"}
                </button>
              </div>
            )}
          </div>

          {/* Inputs chính */}
          <div className="md:col-span-9 grid grid-cols-2 gap-x-6">
            <input
              type="text"
               id="title"
              placeholder="Tiêu đề sách"
              className="bg-gray-400 placeholder-gray-600 placeholder:font-bold text-gray-600 col-span-2 h-12 px-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input
              type="number"
              id="quantity"
              placeholder="Số lượng"
              className="bg-gray-400 placeholder-gray-600 placeholder:font-bold text-gray-600 mt-6 h-12 px-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <input
              type="text"
              id ="published-year"
              placeholder="Năm xuất bản"
              className="bg-gray-400 placeholder-gray-600 placeholder:font-bold text-gray-600 mt-6 h-12 px-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none"
            />
           <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-gray-400 text-gray-600 font-bold mt-6 h-12 px-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none w-full"
      >
        <option value="">Chọn thể loại</option>
        {categories.map((item) => (
          <option key={item._id.$oid} value={item._id.$oid}>
            {item.title}
          </option>
        ))}
      </select>
       <select
        id="authors"
        value={authors}
        onChange={(e) => setAuthors(e.target.value)}
        className="bg-gray-400 text-gray-600 font-bold mt-6 h-12 px-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none w-full"
      >
        <option value="">Chọn tác giả</option>
        {Authors.map((item) => (
          <option key={item._id.$oid} value={item._id.$oid}>
            {item.name}
          </option>
        ))}
      </select>
          </div>
        </div>
        

        {/* Field phụ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <input
            type="text"
            id = "shelf"
            placeholder="Shelf"
            className="bg-gray-400 placeholder-gray-600 placeholder:font-bold text-gray-600 p-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <input
            type="text"
            id = "row"
            placeholder="Row"
            className="bg-gray-400 placeholder-gray-600 placeholder:font-bold text-gray-600 p-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <input
            type="text"
            id = "column"
            placeholder="Column"
            className="bg-gray-400 placeholder-gray-600 placeholder:font-bold text-gray-600 p-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <input
            type="number"
            id = "price"
            placeholder="Price"
            className="bg-gray-400 placeholder-gray-600 placeholder:font-bold text-gray-600 p-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        {/* Mô tả */}
        <textarea
        id = "description"
          placeholder="Description"
          className="bg-gray-400 placeholder-gray-600 placeholder:font-bold text-gray-600 w-full h-48 p-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-teal-500 outline-none mt-8"
        ></textarea>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="submit"  disabled={loading}
            className="px-6 py-2 bg-teal-600 text-gray-800 font-bold rounded-lg hover:bg-teal-700 transition shadow"
          >{loading ? "Đang lưu..." : "Lưu sách"}
          </button>
        </div>
      </form>

      {/* Nút mở chatbox */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg hover:bg-teal-700 transition"
      >
        💬
      </button>

      {/* Chatbox */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="bg-slate-800 text-gray-400 p-3 rounded-t-lg flex justify-between items-center">
            <span>📚 Chat với Thủ thư</span>
            <button onClick={() => setIsChatOpen(false)}>✖</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[70%] ${
                  msg.sender === "user"
                    ? "bg-slate-800 text-gray-400 self-end ml-auto"
                    : "bg-gray-400 self-start"
                }`}
              >
                <strong>{msg.sender === "user" ? "Bạn" : "Thủ thư"}:</strong>{" "}
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex">
            <input
              type="text"
              value={input}
              placeholder="Nhập tin nhắn..."
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-2 py-1 mr-2"
            />
            <button
              onClick={handleSend}
              className="bg-slate-800 text-gray-400 px-3 rounded hover:bg-teal-700"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddBookForm;
