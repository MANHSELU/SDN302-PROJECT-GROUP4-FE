import { useState } from "react";
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";
import { object, string, ValidationError } from 'yup';
import APIAuthor from "../../api/author.api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUer } from "../../../../redux/action/action"; // sửa đường dẫn nếu cần
const userSchema = object({
    email: string().email("email phải đúng định dạng").required("email là bắt buộc"),
    password: string().min(6, "mật khẩu phải yêu cầu 6 số trở lên").required("mật khẩu là bắt buộc")
});
export default function Login() {
    const dispatch = useDispatch();
    const [login, setLogin] = useState({
        email: "",
        password: ""
    })
    const navigator = useNavigate();
    const [errorMessage, setErrorMessage] = useState("")
    const SubmitLogin = async () => {
        try {
            await userSchema.validate(login, { abortEarly: false });
            console.log("✅ Form hợp lệ:", login);
            fetch(APIAuthor.getLogin, {
                method: "POST", // Nếu bạn đang đăng nhập thì cần dùng POST
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: login.email,
                    password: login.password,
                }),
            })
                .then((res) => {
                    if (!res.ok) {
                        setErrorMessage("Email hoặc mật khẩu bị sai")
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log(data)
                    localStorage.setItem("token", data.response.access_Token)
                    fetch(APIAuthor.profileUser, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${data.response.access_Token}`,
                        },
                    })
                        .then((res) => res.json())
                        .then((profileData) => {
                            dispatch(getUer(profileData.data));
                            navigator("/");
                        })
                        .catch((err) => {
                            console.error("Lỗi khi lấy thông tin người dùng:", err);
                        });
                    navigator("/");
                })
                .catch((error) => {
                    console.error("Lỗi khi đăng nhập:", error.message);
                    alert("Đăng nhập không thành công!");
                });
        } catch (err) {
            if (err instanceof ValidationError) {
                err.inner.forEach(e => {
                    console.log("❌ Lỗi:", e.path, e.message);
                });
                setErrorMessage("Email hoặc mật khẩu không đúng")
            } else {
                console.error("❌ Lỗi khác:", err);
                setErrorMessage("Email hoặc mật khẩu không đúng")
            }
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900"
            style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20230425/pngtree-an-old-library-has-wooden-step-leading-to-stairs-image_2513238.jpg')" }}>
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
                            onChange={e => setLogin({ ...login, email: e.target.value })}
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
                            onChange={e => setLogin({ ...login, password: e.target.value })}
                        />
                    </div>
                </div>
                {errorMessage && <p className="text-red-400 text-sm mt-1">{errorMessage}</p>}
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
                <button className="w-full bg-gray-200 text-slate-900 font-bold py-3 rounded hover:bg-gray-300 transition text-lg"
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

