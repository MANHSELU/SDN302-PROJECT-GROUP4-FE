export interface Users {
  _id: string; // id của user
  fullname: string; // họ tên
  email: string; // email
  avatar: string;
  phone: string; // số điện thoại
  role_id: string | null; // có thể null nếu chưa có role
  status: "active" | "inactive"; // trạng thái (ở đây ví dụ active/inactive)
  deleted: boolean; // đã xóa mềm hay chưa
  resertpassword: boolean; // có yêu cầu reset password không
}
