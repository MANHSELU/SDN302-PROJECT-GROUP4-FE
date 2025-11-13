import type { Users } from "./User";
import type { Books } from "./Books";

export interface User_Book {
  _id: string;
  user_id: Users;
  book_id: Books;
  borrow_date?: string;
  return_date?: string;
  status?: string;
  quantity?: number;
  deleted?: boolean;
}
