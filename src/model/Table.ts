export interface Table {
  _id: string;
  title: string;
  price: number;
  status?: "active" | "inactive" | "";
}
