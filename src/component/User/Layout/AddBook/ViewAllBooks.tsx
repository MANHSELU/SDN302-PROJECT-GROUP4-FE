import { useEffect, useState } from "react";

function ViewAllBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState<any | null>(null); // sách đang edit

  // Lấy danh sách sách
  useEffect(() => {
    fetch(`${import.meta.env.VITE_APIPORT}/api/librarian/check/getAllBooks`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  // Mở modal sửa
  const handleEdit = (book: any) => {
    setEditBook(book);
    setShowModal(true);
  };

  // Lưu thay đổi
  const handleSave = async () => {
    if (!editBook) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/librarian/check/updateBooks/${editBook._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
          tittleInput: editBook.title,                // 🟢 trùng với BE
          quantityInput: editBook.quantity,
          published_yearInput: editBook.published_year,
          categoryInput: editBook.categori_id,        // nếu bạn truyền ID category
          authorsInput: editBook.authors,             // nếu bạn truyền ID author
          shelfInput: editBook.shelf,
          rowInput: editBook.row,
          columnInput: editBook.column,
          priceInput: editBook.price,
          descriptionInput: editBook.decription,
        }),
        }
      );

      if (res.ok) {
        const updatedBook = await res.json();
        setBooks((prev) =>
          prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
        );
        setShowModal(false);
        alert("Cập nhật thành công");

      } else {
        console.error("❌ Lỗi khi cập nhật sách");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Xóa sách
  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sách này không?")) {
      try {
        await fetch(`http://localhost:3000/api/librarian/check/deleteBooks/${id}`, {
          method: "DELETE",
        });
        setBooks((prev) => prev.filter((b: any) => b._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-[url('https://copilot.microsoft.com/th/id/BCO.bc37d8a3-a52d-4231-9c04-93c5e7707375.png')] 
      bg-cover bg-center"
    >
      <div className="bg-[#0f172a]/80 backdrop-blur-md rounded-2xl shadow-xl w-[90%] max-w-6xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">📚 Danh Sách Sách</h1>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-[#1e293b] text-gray-200">
              <tr>
                <th className="p-3 text-left">Ảnh</th>
                <th className="p-3 text-left">Tên Sách</th>
                <th className="p-3 text-left">Số lượng</th>
                <th className="p-3 text-left">Năm XB</th>
                <th className="p-3 text-left">Thể loại</th>
                <th className="p-3 text-left">Giá</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-t border-gray-700 hover:bg-[#334155] transition"
                >
                  <td className="p-3">
                    <img
                      src={book.image?.[0]}
                      alt={book.title}
                      className="w-14 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.quantity}</td>
                  <td className="p-3">{book.published_year}</td>
                  <td className="p-3">{book.categori_id?.[0]?.title || "N/A"}</td>
                  <td className="p-3">{book.price?.toLocaleString()}đ</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-blue-500 px-3 py-1 rounded mr-2 hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {books.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-gray-400 py-6 italic"
                  >
                    Không có sách nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

     {/* Modal Edit */}
{showModal && editBook && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[450px] max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        ✏️ Cập nhật sách
      </h2>

      <div className="space-y-3">
        <input
          type="text"
          value={editBook.title || ""}
          onChange={(e) =>
            setEditBook({ ...editBook, title: e.target.value })
          }
          placeholder="Tên sách"
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="number"
          value={editBook.quantity || ""}
          onChange={(e) =>
            setEditBook({ ...editBook, quantity: +e.target.value })
          }
          placeholder="Số lượng"
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="number"
          value={editBook.published_year || ""}
          onChange={(e) =>
            setEditBook({ ...editBook, published_year: +e.target.value })
          }
          placeholder="Năm xuất bản"
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="text"
          value={editBook.categori_id?.[0].title || "" }
          onChange={(e) =>
            setEditBook({ ...editBook, category_id: e.target.value })
          }
          placeholder="Mã thể loại"
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="text"
          value={editBook.authors?.name || "" } 
          onChange={(e) =>
            setEditBook({ ...editBook, authors: e.target.value })
          }
          placeholder="Tác giả"
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="text"
          value={editBook.shelf || ""}
          onChange={(e) =>
            setEditBook({ ...editBook, shelf: e.target.value })
          }
          placeholder="Kệ sách"
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="number"
          value={editBook.row || ""}
          onChange={(e) =>
            setEditBook({ ...editBook, row: +e.target.value })
          }
          placeholder="Hàng"
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="number"
          value={editBook.column || "" }
          onChange={(e) =>
            setEditBook({ ...editBook, column: +e.target.value })
          }
          placeholder="Cột"
          className="w-full p-2 border rounded text-black"
        />

        <input
          type="number"
          value={editBook.price || "" }
          onChange={(e) =>
            setEditBook({ ...editBook, price: +e.target.value })
          }
          placeholder="Giá"
          className="w-full p-2 border rounded text-black"
        />

        <textarea
          value={editBook.decription || "" }
          onChange={(e) =>
            setEditBook({ ...editBook, decription: e.target.value })
          }
          placeholder="Mô tả"
          className="w-full p-2 border rounded text-black min-h-[100px]"
        />
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Lưu
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default ViewAllBooks;
