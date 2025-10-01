import type { Users } from "./User";

export interface User_Book {
  _id: string; // id của user
  user_id: Users;
  table_id: string;
  time_slot: [string];
}
