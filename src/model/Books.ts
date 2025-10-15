export interface Books {
  _id?: string;
  title: string;
  quantity?: number | null;
  slug?: string;
  authors?: {
    name: string;
    image_author: string;
    bio: string;
  };
  published_year?: string | null;
  decription?: string | null;
  date?: string;
  image: string[];
  categori_id: string[];
  shelf?: number | null;
  row?: number | null;
  column?: number | null;
  price?: number | null;
  status?: "active" | "inactive" | "";
}
