import { useEffect, useState } from "react";
import { Table, Search } from "lucide-react";
import APITable from "../../api/table.api";
import type { User_Table } from "../../../../model/User_Table";

function statusColor(status?: string) {
  if (status === "active") return "text-blue-400 font-semibold";
  if (status === "inactive") return "text-red-500 font-semibold";
  return "text-gray-400 font-semibold";
}

function statusLabel(status?: string) {
  if (status === "active") return "Đang sử dụng";
  if (status === "inactive") return "Đã huỷ";
  return "Không xác định";
}

export default function OrderTablePage() {
  const [orders, setOrders] = useState<User_Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    fetch(APITable.getOrderTable, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      })
      .catch(() => {
        setError("Không thể tải dữ liệu.");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Lọc theo search
  const filteredOrders = orders.filter((order) =>
    order.table_id?.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Phân trang
  const totalPage = Math.ceil(filteredOrders.length / pageSize);
  const pagedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Hàm hiển thị lại tất cả lịch sử đặt bàn
  const handleShowAll = () => {
    setInputSearch("");
    setSearch("");
    setPage(1);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-start justify-center p-12"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1700145872464-4beb41df93a3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 w-full max-w-7xl flex justify-center">
        {/* Content - Lịch sử đặt bàn chiếm toàn bộ chiều ngang */}
        <div className="w-full bg-slate-900/80 rounded-xl p-10 shadow-lg min-h-[600px] h-[600px] flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Table className="w-8 h-8 text-yellow-400" />
            LỊCH SỬ ĐẶT BÀN
          </h1>
          {/* Search */}
          <div className="flex items-center bg-white rounded-lg px-3 py-2 mb-2 shadow-md">
            <Search className="text-slate-400 w-6 h-6 mr-2" />
            <input
              type="text"
              placeholder="Tìm kiếm bàn..."
              className="flex-1 bg-transparent outline-none text-slate-800 text-lg"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            />
            <button
              className="ml-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-4 py-2 rounded-lg transition"
              onClick={() => {
                setSearch(inputSearch);
                setPage(1);
              }}
            >
              Tìm kiếm
            </button>
          </div>
          {/* Nút tất cả - căn trái, dưới thanh search, khoảng cách đẹp */}
          <div className="flex justify-start mb-6 mt-2">
            <button
              className="px-3 py-1 bg-slate-700 hover:bg-yellow-400 hover:text-slate-900 text-slate-200 rounded transition text-sm font-semibold"
              onClick={handleShowAll}
            >
              Tất cả
            </button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-slate-100 rounded-lg overflow-hidden text-lg">
              <thead>
                <tr className="bg-slate-800 text-slate-200">
                  <th className="px-5 py-4">Tên bàn</th>
                  <th className="px-5 py-4">Giá bàn</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4">Ngày đặt</th>
                  <th className="px-5 py-4">Khung giờ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : pagedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Không có đơn đặt bàn nào.
                    </td>
                  </tr>
                ) : (
                  pagedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-slate-700 hover:bg-slate-800/70"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {order.table_id?.title}
                      </td>
                      <td className="px-5 py-4 text-yellow-400 font-bold">
                        {order.table_id?.price
                          ? order.table_id.price.toLocaleString() + " VND"
                          : ""}
                      </td>
                      <td
                        className={`px-5 py-4 ${statusColor(
                          order.table_id?.status
                        )}`}
                      >
                        {statusLabel(order.table_id?.status)}
                      </td>
                      <td className="px-5 py-4">
                        {order.time_date
                          ? new Date(order.time_date).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-5 py-4">
                        {order.time_slot?.join(", ")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPage > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPage }, (_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    page === i + 1
                      ? "bg-yellow-400 text-slate-900"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
