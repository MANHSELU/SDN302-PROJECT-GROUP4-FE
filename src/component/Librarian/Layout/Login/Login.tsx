import { useState } from "react";
import {
    FaEnvelope,
    FaLock,
    FaGoogle,
    FaFacebookF,
    FaInstagram,
} from "react-icons/fa";
import { object, string, ValidationError } from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUer } from "../../../../redux/action/action"; // chỉnh lại đường dẫn nếu khác
import APIBookLibrarian from "../../api/book.api";

// Validation schema
const userSchema = object({
    email: string().email("Email phải đúng định dạng").required("Email là bắt buộc"),
    password: string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu là bắt buộc"),
});

export default function LoginLibrarian() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, setLogin] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const SubmitLogin = async () => {
        try {
            await userSchema.validate(login, { abortEarly: false });
            console.log("✅ Form hợp lệ:", login);
            const res = await fetch(APIBookLibrarian.getLogin, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login),
            });

            if (!res.ok) {
                setErrorMessage("Email hoặc mật khẩu không chính xác");
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.response.access_Token);

            const profileRes = await fetch(APIBookLibrarian.profileUser, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.response.access_Token}`,
                },
            });

            const profileData = await profileRes.json();
            console.log("profile Data là : ", profileData)
            dispatch(getUer(profileData.data));
            navigate("/librarian");
        } catch (err) {
            if (err instanceof ValidationError) {
                setErrorMessage("Vui lòng nhập đúng email và mật khẩu");
            } else {
                console.error("❌ Lỗi khác:", err);
                setErrorMessage("Có lỗi xảy ra, vui lòng thử lại");
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
            style={{
                backgroundImage:
                    "url('https://png.pngtree.com/thumb_back/fh260/background/20230425/pngtree-an-old-library-has-wooden-step-leading-to-stairs-image_2513238.jpg')",
                backgroundSize: "cover",
                backgroundBlendMode: "overlay",
            }}
        >
            <div className="bg-black/70 p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 backdrop-blur-md">
                {/* Title */}
                <h2 className="text-4xl font-bold text-teal-400 text-center mb-10 drop-shadow-lg">
                    Đăng Nhập Thủ Thư
                </h2>

                {/* Email */}
                <div className="mb-6">
                    <div className="flex items-center bg-gray-800 rounded-lg">
                        <span className="px-4 text-teal-400 text-lg">
                            <FaEnvelope />
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 bg-gray-800 text-gray-100 rounded-r focus:outline-none text-lg"
                            value={login.email}
                            onChange={(e) => setLogin({ ...login, email: e.target.value })}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mb-6">
                    <div className="flex items-center bg-gray-800 rounded-lg">
                        <span className="px-4 text-teal-400 text-lg">
                            <FaLock />
                        </span>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full px-4 py-3 bg-gray-800 text-gray-100 rounded-r focus:outline-none text-lg"
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
                    <label className="flex items-center gap-2 text-gray-300">
                        <input type="checkbox" className="accent-teal-500 scale-110" />
                        Ghi nhớ đăng nhập
                    </label>
                    <a href="#" className="text-teal-400 hover:underline">
                        Quên mật khẩu?
                    </a>
                </div>

                {/* Button */}
                <button
                    className="w-full bg-teal-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-teal-400 transition-transform hover:scale-[1.02] text-lg shadow-md"
                    onClick={SubmitLogin}
                >
                    Đăng nhập
                </button>

                {/* Divider */}
                <div className="flex items-center my-8">
                    <div className="flex-grow border-t border-gray-500"></div>
                    <span className="px-3 text-gray-400 text-base">Hoặc</span>
                    <div className="flex-grow border-t border-gray-500"></div>
                </div>

                {/* Social Login */}
                <div className="flex justify-center gap-6 mb-8">
                    <button className="bg-gray-100 p-4 rounded-full hover:scale-105 transition">
                        <FaGoogle className="text-red-500 text-xl" />
                    </button>
                    <button className="bg-gray-100 p-4 rounded-full hover:scale-105 transition">
                        <FaFacebookF className="text-blue-600 text-xl" />
                    </button>
                    <button className="bg-gray-100 p-4 rounded-full hover:scale-105 transition">
                        <FaInstagram className="text-pink-500 text-xl" />
                    </button>
                </div>

                {/* Register link */}
                <p className="text-center text-gray-300 text-base">
                    Chưa có tài khoản?{" "}
                    <a href="#" className="text-teal-400 font-semibold hover:underline">
                        Đăng ký ngay
                    </a>
                </p>
            </div>
        </div>
    );
}
