export interface Books {
  _id: string;
  title: string;
  quantity: number;
  slug: string;
  authors: {
    name: string;
    image_author: string;
    bio: string;
  }; // Tác giả
  published_year: string; // Năm xuất bản (string vì bạn lưu "2020")
  decription: string; // Mô tả (lưu ý bạn đang viết thiếu chữ 's')
  date: string; // Ngày (ISO string)
  image: string[]; // Danh sách URL ảnh
  categori_id: string[]; // Danh sách id thể loại
  shelf: number; // Kệ
  row: number; // Hàng
  column: number; // Cột
  price: number; // Giá
  status: "active" | "inactive"; // Trạng thái
}
