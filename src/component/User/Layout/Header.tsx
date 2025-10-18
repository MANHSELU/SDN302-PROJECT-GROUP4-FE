import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Home,
  Book,
  User,
  Phone,
  LogOut,
  Bell,
  Mail,
  Table,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import type allReducers from "../../../redux/reducer/Redux";
import { useDispatch, useSelector } from "react-redux";
import type { Users } from "../../../model/User";
import APIAuthor from "../api/author.api";
import { getUer } from "../../../redux/action/action";
import { LogIn, UserPlus } from "lucide-react";

function Header() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<Users | null>(null);
  const users = useSelector(
    (state: ReturnType<typeof allReducers>) => state.getuser.user
  );
  useEffect(() => {
    if (!token || token == null) return;
    if (Object.keys(users).length === 0 || !users) {
      fetch(APIAuthor.profileUser, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.data);
          dispatch(getUer(data.data));
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    } else if (Object.keys(users).length !== 0) {
      setUser(users as Users);
    }
  }, [token, users, dispatch]);
  return (
    <div className="h-screen w-screen flex bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className="group fixed top-0 left-0 h-screen w-16 hover:w-56 
                  bg-slate-800 flex flex-col items-start py-6 gap-6 
                  transition-all duration-300 shadow-lg z-50 overflow-hidden 
                  rounded-none group-hover:rounded-r-2xl"
      >
        {/* Logo */}
        <BookOpen className="h-7 w-7 text-yellow-400 mx-auto transition-transform duration-300 group-hover:scale-110" />

        <nav className="flex flex-col gap-2 text-slate-300 w-full mt-4">
          {[
            { icon: Home, label: "Trang chủ", href: "" },
            { icon: Book, label: "Sách", href: "/book" },
            { icon: User, label: "Người dùng", href: "/profile" },
            { icon: Table, label: "Đặt Bàn", href: "/bookingtable" },
            { icon: BookOpen, label: "Sách đã mượn", href: "/borrowhistory" },
            { icon: Heart, label: "Sách yêu thích", href: "/favoritebooks" },
            { icon: Phone, label: "Liên hệ", href: "" },
            { icon: LogOut, label: "Đăng xuất", href: "" },
          ].map(({ icon: Icon, label, href }) => (
            <Link
              to={href}
              key={label}
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-slate-700 cursor-pointer transition-all duration-300"
            >
              {/* Icon luôn hiển thị */}
              <Icon className="h-5 w-5 text-slate-300 hover:text-yellow-400 transition-transform" />

              {/* Label chỉ hiện khi zoom */}
              <span className="hidden group-hover:inline text-sm whitespace-nowrap">
                {label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-16 group-hover:ml-56 transition-all duration-300">
        {/* Header */}
        <header className="w-full h-16 bg-slate-900 text-slate-100 flex items-center px-6 shadow">
          <nav className="flex items-center gap-6 font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-bold border-b-2 border-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }
            >
              Library
            </NavLink>
            <NavLink
              to="/book"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-bold border-b-2 border-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }
            >
              Books
            </NavLink>
          </nav>

          <div className="flex-1" />
          {user ? (
            <div className="flex items-center gap-6">
              <div className="relative">
                <Bell className="h-5 w-5 text-slate-300 hover:text-white cursor-pointer" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400"></span>
              </div>
              <div className="relative">
                <Mail className="h-5 w-5 text-slate-300 hover:text-white cursor-pointer" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400"></span>
              </div>
              <Link to={"/profile"}>
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt="user"
                    className="h-9 w-9 rounded-full border-2 border-yellow-400"
                  />
                  <span className="font-medium">{user.fullname}</span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Nút Đăng nhập */}
              <button
                className="flex items-center gap-2 px-6 py-2.5 
               bg-blue-600 hover:bg-blue-700 
               text-white text-lg font-semibold 
               rounded-full shadow-md 
               hover:shadow-blue-500/40 
               transform hover:scale-105 
               transition duration-300"
                onClick={() => navigator("/login")}
              >
                <LogIn className="w-5 h-5" />
                Đăng nhập
              </button>

              {/* Nút Đăng ký */}
              <button
                className="flex items-center gap-2 px-6 py-2.5 
               bg-green-600 hover:bg-green-700 
               text-white text-lg font-semibold 
               rounded-full shadow-md 
               hover:shadow-green-500/40 
               transform hover:scale-105 
               transition duration-300"
                onClick={() => navigator("/register")}
              >
                <UserPlus className="w-5 h-5" />
                Đăng ký
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Header;
