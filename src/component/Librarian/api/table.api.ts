const portApi = import.meta.env.VITE_APIPORT;
const APITableLibranrian = {
  getUserTable: `${portApi}/api/librarian/check/tables`,
  addTable: `${portApi}/api/librarian/check/tables`,
  deleteTable: `${portApi}/api/librarian/check/tables`,
  updateTable: `${portApi}/api/librarian/check/tables`,
  chanegTable: `${portApi}/api/librarian/check/tableschange`,
  ListOderTable: `${portApi}/api/librarian/check/orders/tables`,
};
export default APITableLibranrian;
