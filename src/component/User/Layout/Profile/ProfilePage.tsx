import { User, Mail, Phone, MapPin } from "lucide-react";

function ProfilePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-slate-100 p-10"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="bg-slate-900/80 rounded-3xl p-10 shadow-2xl w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Thông tin bên trái */}
        <div className="flex flex-col items-center justify-center">
          <img
            src="https://i.pravatar.cc/200"
            alt="Avatar"
            className="h-52 w-52 rounded-full border-4 border-yellow-400 mb-8 object-cover shadow-lg"
          />
          <h2 className="text-3xl font-bold">Tên người dùng</h2>
          <p className="text-slate-300 text-xl mt-2">Vai trò</p>
        </div>

        {/* Form chỉnh sửa thông tin */}
        <div className="bg-slate-800/90 rounded-2xl p-8 shadow-xl">
          <form className="flex flex-col gap-6">
            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-yellow-400">
              <User className="h-6 w-6 text-slate-600 mr-3" />
              <input
                type="text"
                placeholder="Tên người dùng"
                className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-500 text-lg"
              />
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-yellow-400">
              <Mail className="h-6 w-6 text-slate-600 mr-3" />
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-500 text-lg"
              />
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-yellow-400">
              <Phone className="h-6 w-6 text-slate-600 mr-3" />
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-500 text-lg"
              />
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-yellow-400">
              <MapPin className="h-6 w-6 text-slate-600 mr-3" />
              <input
                type="text"
                placeholder="Địa chỉ"
                className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-500 text-lg"
              />
            </div>

            <button
              type="submit"
              className="self-end bg-yellow-400 text-slate-900 font-semibold px-8 py-3 rounded-lg hover:bg-yellow-500 transition text-lg shadow-lg"
            >
              Lưu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
