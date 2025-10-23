import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, UserPlus, DollarSign, Home } from "lucide-react";
import { useEffect, useState } from "react";
import APIUsers from "../../api/getusers.api";
const Dashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState<any[]>([]);
    const [totalUser, setTotalUser] = useState<any[]>([]);
    const [totalNewUser, setTotalNewUser] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const currentDate = new Date();
    const currentYear = new Date().getFullYear();
// Lấy thống kê doanh thu các tháng trong năm
useEffect(() => {
  fetch(APIUsers.getRevenueDashboards)
    .then((res) => res.json())
    .then((data)=> {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const chart = data.map((revenue : number, index : number) => ({
        month: months[index],
        revenue: revenue
      }));
      setChartData(chart);
    })
    .catch((err) => console.error(err));
}, []);
// Lấy tổng doanh thu 
useEffect(()=>{
  fetch(APIUsers.getTotalRevenues)
  .then((res) => res.json())
  .then((data) => setTotalRevenue(data))
  .catch((err)=> console.error(err));
},[])
// Lấy tổng User
useEffect(()=>{
  fetch(APIUsers.getTotalUsers)
  .then((res) => res.json())
  .then((data) => setTotalUser(data))
  .catch((err)=> console.error(err));
},[])
// Lấy tổng User mới theo tháng
useEffect(()=>{
  fetch(APIUsers.getTotalNewUsers)
  .then((res) => res.json())
  .then((data) => setTotalNewUser(data))
  .catch((err)=> console.error(err));
},[])
  return (
    <div className="min-h-screen bg-[#f5f8fc] p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Home className="text-blue-500" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Tổng quan doanh thu và người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Chart */}
        <div className="col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Thống kê doanh thu theo tháng
          </h2>
          <p className="text-sm text-gray-400 mb-6">Năm 2025</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    
                  }}
                    formatter={(value: number) =>value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} // ==> value lấy từ dataKey = revenue ( tức là format revenue)
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right - Stats */}
        <div className="flex flex-col gap-4">
          {/* Tổng số user */}
          <div className="bg-white shadow-md rounded-2xl p-5 flex justify-between items-center h-32">
            <div>
              <p className="text-gray-500 text-sm">Tổng số người dùng</p>
              <h3 className="text-2xl font-semibold text-blue-600">{totalUser}</h3>
              <p className="text-xs text-gray-400">{currentDate.toLocaleDateString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="text-blue-600" size={22} />
            </div>
          </div>

          {/* Người dùng mới */}
          <div className="bg-white shadow-md rounded-2xl p-5 flex justify-between items-center h-32">
            <div>
              <p className="text-gray-500 text-sm">Người dùng mới</p>
              <h3 className="text-2xl font-semibold text-green-600">{totalNewUser}</h3>
              <p className="text-xs text-gray-400">Trong tháng này</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <UserPlus className="text-green-600" size={22} />
            </div>
          </div>

          {/* Tổng doanh thu */}
          <div className="bg-white shadow-md rounded-2xl p-5 flex justify-between items-center h-32">
            <div>
              <p className="text-gray-500 text-sm">Tổng doanh thu</p>
              <h3 className="text-2xl font-semibold text-orange-500">
                 {totalRevenue.toLocaleString("vi-VN")}₫
              </h3>
              <p className="text-xs text-gray-400">Năm {currentYear}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <DollarSign className="text-orange-500" size={22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
