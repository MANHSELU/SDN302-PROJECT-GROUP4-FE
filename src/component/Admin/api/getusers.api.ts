const portApi = import.meta.env.VITE_APIPORT;
const APIUsers = {
  getAllUsers: `${portApi}/admincheck/getAllUser`,
  getTotalRevenues: `${portApi}/admincheck/getTotalRevenue`,
  getTotalUsers: `${portApi}/admincheck/getAllTotalUser`,
  getTotalNewUsers: `${portApi}/admincheck/getTotalNewUser`,
  getRevenueDashboards: `${portApi}/admincheck/getRevenueDashboard`,


};
export default APIUsers;
