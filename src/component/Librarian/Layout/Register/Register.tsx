import { FaUser, FaEnvelope, FaLock, FaEye, FaPhone } from "react-icons/fa";

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900"
            style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20230425/pngtree-an-old-library-has-wooden-step-leading-to-stairs-image_2513238.jpg')" }}>
            <div className="bg-teal-900 p-12 rounded-lg shadow-lg w-full max-w-lg">
                {/* Title */}
                <h2 className="text-3xl font-bold text-white text-center mb-10">
                    Đăng Ký
                </h2>

                {/* User Name */}
                <div className="mb-6">
                    <div className="flex items-center bg-gray-100 rounded">
                        <span className="px-4 text-gray-600 text-lg">
                            <FaUser />
                        </span>
                        <input
                            type="text"
                            placeholder="User Name"
                            className="w-full px-4 py-3 bg-gray-100 rounded-r focus:outline-none text-lg"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-6">
                    <div className="flex items-center bg-gray-100 rounded">
                        <span className="px-4 text-gray-600 text-lg">
                            <FaEnvelope />
                        </span>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 bg-gray-100 rounded-r focus:outline-none text-lg"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="mb-6">
                    <div className="flex items-center bg-gray-100 rounded">
                        <span className="px-4 text-gray-600 text-lg">
                            <FaPhone />
                        </span>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full px-4 py-3 bg-gray-100 rounded-r focus:outline-none text-lg"
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
                            placeholder="Password"
                            className="w-full px-4 py-3 bg-gray-100 rounded-r focus:outline-none text-lg"
                        />
                        <span className="px-4 text-gray-500 text-lg cursor-pointer">
                            <FaEye />
                        </span>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-8">
                    <div className="flex items-center bg-gray-100 rounded">
                        <span className="px-4 text-gray-600 text-lg">
                            <FaLock />
                        </span>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full px-4 py-3 bg-gray-100 rounded-r focus:outline-none text-lg"
                        />
                        <span className="px-4 text-gray-500 text-lg cursor-pointer">
                            <FaEye />
                        </span>
                    </div>
                </div>

                {/* Button */}
                <button className="w-full bg-gray-200 text-slate-900 font-bold py-3 rounded hover:bg-gray-300 transition text-lg">
                    Đăng Ký
                </button>

                {/* Link to login */}
                <p className="text-center text-gray-200 text-base mt-8">
                    Bạn đã có tài khoản trước đó?{" "}
                    <a href="#" className="text-white font-bold hover:underline">
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}
