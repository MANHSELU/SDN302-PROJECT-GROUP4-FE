const portApi = import.meta.env.VITE_APIPORT;
const APIUsers = {
  getAllUsers: `${portApi}/admincheck/getAllUser`,
  getTotalRevenues: `${portApi}/admincheck/getTotalRevenue`,
  getTotalUsers: `${portApi}/admincheck/getAllTotalUser`,
  getTotalNewUsers: `${portApi}/admincheck/getTotalNewUser`,
  getRevenueDashboards: `${portApi}/admincheck/getRevenueDashboard`,
  banUser: `${portApi}/admincheck/banUsers`,
  unBanUser: `${portApi}/admincheck/unBanUsers`,




};
export default APIUsers;
