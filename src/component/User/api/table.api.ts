const portApi = import.meta.env.VITE_APIPORT;
const APITable = {
  getTable: `${portApi}/api/user/check/getTable`,
  getUserTable: `${portApi}/api/user/check/getUerTable`,
};
export default APITable;
