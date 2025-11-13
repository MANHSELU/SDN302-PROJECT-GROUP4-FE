import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUer } from "../../../../redux/action/action";
import APIAdmin from "../../api/getusers.api";

interface LoginForm {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    global?: string;
}

const schema = yup.object({
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Vui lòng nhập mật khẩu"),
});

export default function LoginAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        try {
            await schema.validate(form, { abortEarly: false });
            setLoading(true);

            const res = await fetch(APIAdmin.getLogin, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Email hoặc mật khẩu sai");

            const data = await res.json();
            const token = data?.response?.access_Token;
            const refreshToken = data?.response?.refresh_token;

            if (!token || !refreshToken) throw new Error("Không nhận được token từ server");

            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);

            const profileRes = await fetch(APIAdmin.getProfile, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!profileRes.ok) throw new Error("Không thể lấy thông tin admin");

            const profileData = await profileRes.json();
            dispatch(getUer(profileData.data));
            navigate("/Dashboard");
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const fieldErrors: FormErrors = {};
                err.inner.forEach((e) => {
                    if (e.path) fieldErrors[e.path as keyof LoginForm] = e.message;
                });
                setErrors(fieldErrors);
            } else if (err instanceof Error) {
                setErrors({ global: err.message });
            } else {
                setErrors({ global: "Đã xảy ra lỗi không xác định." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md">
                <h2 className="text-4xl font-bold text-center text-white mb-8 tracking-wide">
                    👑 Admin Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-100 mb-2">
                            Email
                        </label>
                        <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                            <FaEnvelope className="text-cyan-300 text-lg mr-3" />
                            <input
                                name="email"
                                type="email"
                                placeholder="admin@domain.com"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-100 mb-2">
                            Mật khẩu
                        </label>
                        <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                            <FaLock className="text-cyan-300 text-lg mr-3" />
                            <input
                                name="password"
                                type={showPass ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass((s) => !s)}
                                className="text-cyan-300 hover:text-white transition"
                            >
                                {showPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Error message */}
                    {errors.global && (
                        <p className="text-red-400 text-center text-sm">{errors.global}</p>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}
