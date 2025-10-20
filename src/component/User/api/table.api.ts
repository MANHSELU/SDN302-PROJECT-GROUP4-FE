const portApi = import.meta.env.VITE_APIPORT;
const APITable = {
  getTable: `${portApi}/api/user/check/getTable`,
  getUserTable: `${portApi}/api/user/check/getUerTable`,
  postUserTable: `${portApi}/api/user/check/postTableUser`,
  getOrderTable: `${portApi}/api/user/check/ordertable`,
};
export default APITable;
