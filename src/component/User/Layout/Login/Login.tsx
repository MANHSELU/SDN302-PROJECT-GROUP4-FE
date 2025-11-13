import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { object, string, ValidationError } from "yup";
import APIAuthor from "../../api/author.api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUer } from "../../../../redux/action/action"; // sửa đường dẫn nếu cần
const userSchema = object({
  email: string()
    .email("email phải đúng định dạng")
    .required("email là bắt buộc"),
  password: string()
    .min(6, "mật khẩu phải yêu cầu 6 số trở lên")
    .required("mật khẩu là bắt buộc"),
});
export default function Login() {
  const dispatch = useDispatch();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const navigator = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const SubmitLogin = async () => {
    try {
      // ✅ Kiểm tra hợp lệ form
      await userSchema.validate(login, { abortEarly: false });
      console.log("✅ Form hợp lệ:", login);

      // ✅ Gửi yêu cầu đăng nhập
      const res = await fetch(APIAuthor.getLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });

      if (!res.ok) {
        setErrorMessage("Email hoặc mật khẩu bị sai");
        return;
      }

      const data = await res.json();
      console.log("Dữ liệu login:", data);

      // ✅ Lưu token
      const token = data?.response?.access_Token;
      const refreshToken = data?.response?.refresh_token;
      console.log("token:", token);
      console.log("refreshToken:", refreshToken);
      if (!token || !refreshToken) {
        setErrorMessage("Không nhận được token từ server");
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken)
      // ✅ Lấy thông tin user
      const profileRes = await fetch(APIAuthor.profileUser, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileRes.ok) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      const profileData = await profileRes.json();
      console.log("user khi login là :", profileData.data);

      // ✅ Cập nhật Redux
      dispatch(getUer(profileData.data));

      // ✅ Sau khi Redux cập nhật xong, mới điều hướng
      navigator("/");

    } catch (err) {
      if (err instanceof ValidationError) {
        err.inner.forEach((e) => {
          console.log("❌ Lỗi:", e.path, e.message);
        });
        setErrorMessage("Email hoặc mật khẩu không đúng");
      } else {
        console.error("❌ Lỗi khác:", err);
        setErrorMessage("Đăng nhập thất bại, vui lòng thử lại");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-900"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/thumb_back/fh260/background/20230425/pngtree-an-old-library-has-wooden-step-leading-to-stairs-image_2513238.jpg')",
      }}
    >
      <div className="bg-teal-900 p-10 rounded-lg shadow-lg w-full max-w-lg">
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Đăng Nhập
        </h2>

        {/* Email */}
        <div className="mb-6">
          <div className="flex items-center bg-gray-100 rounded">
            <span className="px-4 text-gray-600 text-lg">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-100 text-slate-900 rounded-r focus:outline-none text-lg"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <div className="flex items-center bg-gray-100 rounded">
            <span className="px-4 text-gray-600 text-lg">
              <FaLock />
            </span>
            <input
              type="password"
              placeholder="Your Password"
              className="w-full px-4 py-3 bg-gray-100 text-slate-900 rounded-r focus:outline-none text-lg"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </div>
        </div>
        {errorMessage && (
          <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
        )}
        {/* Options */}
        <div className="flex items-center justify-between text-base mb-8">
          <label className="flex items-center gap-2 text-gray-200">
            <input type="checkbox" className="accent-teal-500 scale-110" />
            Ghi nhớ mật khẩu
          </label>
          <a href="#" className="text-white hover:underline">
            Quên mật khẩu ?
          </a>
        </div>

        {/* Button */}
        <button
          className="w-full bg-gray-200 text-slate-900 font-bold py-3 rounded hover:bg-gray-300 transition text-lg"
          onClick={SubmitLogin}
        >
          Đăng nhập
        </button>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-3 text-gray-200 text-base">or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-6 mb-8">
          <button className="bg-white p-4 rounded shadow hover:scale-105 transition">
            <FaGoogle className="text-red-500 text-xl" />
          </button>
          <button className="bg-white p-4 rounded shadow hover:scale-105 transition">
            <FaFacebookF className="text-blue-600 text-xl" />
          </button>
          <button className="bg-white p-4 rounded shadow hover:scale-105 transition">
            <FaInstagram className="text-pink-500 text-xl" />
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-gray-200 text-base">
          Bạn chưa có tài khoản trước đó?{" "}
          <a href="#" className="text-white font-bold hover:underline">
            Đăng kí
          </a>
        </p>
      </div>
    </div>
  );
}