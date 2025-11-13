import type { Table } from "./Table";
import type { Users } from "./User";

export interface User_Table {
  _id: string;
  user_id: Users;
  table_id: Table;
  time_date: string;
  time_slot: string[];
}
