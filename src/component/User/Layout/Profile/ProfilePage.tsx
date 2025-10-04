import { User as UserIcon, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import APIAuthor from "../../api/author.api";
import { useDispatch } from "react-redux";
import { getUer } from "../../../../redux/action/action";
import type { Users } from "../../../../model/User";

function ProfilePage() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [me, setMe] = useState<Partial<Users>>({});
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(APIAuthor.profileUser, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setMe(d.data);
        setFullname(d.data?.fullname || "");
        setPhone(d.data?.phone || "");
        dispatch(getUer(d.data));
      })
      .catch(console.error);
  }, [token, dispatch]);

  const onSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const form = new FormData();
    form.append("fullname", fullname);
    form.append("phone", phone);
    if (avatarFile) form.append("avatar", avatarFile);

    const res = await fetch(APIAuthor.updateProfile, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Cập nhật thất bại");
    setMe(data.data);
    dispatch(getUer(data.data));
    alert("Cập nhật hồ sơ thành công");
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const res = await fetch(APIAuthor.changePassword, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Đổi mật khẩu thất bại");
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    alert("Đổi mật khẩu thành công");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-slate-100 p-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="bg-slate-900/80 rounded-3xl p-10 shadow-2xl w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: info */}
        <div className="flex flex-col items-center justify-center">
          <img
            src={me?.avatar || "https://i.pravatar.cc/200"}
            alt="Avatar"
            className="h-52 w-52 rounded-full border-4 border-yellow-400 mb-8 object-cover shadow-lg"
          />
          <h2 className="text-3xl font-bold">{me?.fullname || "Người dùng"}</h2>
          <p className="text-slate-300 text-xl mt-2">{me?.email}</p>
        </div>
        {/* Right: forms */}
        <div className="bg-slate-800/90 rounded-2xl p-8 shadow-xl">
          <form className="flex flex-col gap-6" onSubmit={onSubmitProfile}>
            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-3">
              <UserIcon className="h-6 w-6 text-slate-600 mr-3" />
              <input
                type="text"
                placeholder="Họ tên"
                className="flex-1 bg-transparent outline-none text-slate-800 text-lg"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-3">
              <Mail className="h-6 w-6 text-slate-600 mr-3" />
              <input
                type="email"
                disabled
                value={me?.email || ""}
                className="flex-1 bg-transparent outline-none text-slate-800 text-lg"
              />
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-3">
              <Phone className="h-6 w-6 text-slate-600 mr-3" />
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="flex-1 bg-transparent outline-none text-slate-800 text-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />
            <button
              type="submit"
              className="self-end bg-yellow-400 text-slate-900 font-semibold px-8 py-3 rounded-lg hover:bg-yellow-500 transition text-lg shadow-lg"
            >
              Lưu
            </button>
          </form>
          <hr className="my-6 border-slate-700" />
          <form className="flex flex-col gap-4" onSubmit={onChangePassword}>
            <input
              type="password"
              placeholder="Mật khẩu cũ"
              className="bg-slate-100 rounded-lg px-4 py-3 text-slate-800"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="bg-slate-100 rounded-lg px-4 py-3 text-slate-800"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              className="bg-slate-100 rounded-lg px-4 py-3 text-slate-800"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button className="self-end bg-teal-400 text-slate-900 font-semibold px-8 py-3 rounded-lg hover:bg-teal-500 transition text-lg shadow-lg">
              Đổi mật khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
