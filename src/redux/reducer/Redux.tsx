import { combineReducers } from "redux";
import getuser from "./getusser";
// đây chính là store dùng để lưu dữ các dữ liệu của mình
const allReducers = combineReducers({
  getuser,
});
export default allReducers;
