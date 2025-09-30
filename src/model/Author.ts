export interface Author {
  _id?: string;
  name: string;
  image_author?: string;
  bio?: string;
  birthdate?: Date;
  status?: "active" | "inactive";
}
