const portApi = import.meta.env.VITE_APIPORT;
const APIUsers = {
  getAllUsers: `${portApi}/admincheck/getAllUser`,
  getTotalRevenues: `${portApi}/admincheck/getTotalRevenue`,
  getTotalUsers: `${portApi}/admincheck/getAllTotalUser`,
  getTotalNewUsers: `${portApi}/admincheck/getTotalNewUser`,
  getRevenueDashboards: `${portApi}/admincheck/getRevenueDashboard`,
  banUser: `${portApi}/admincheck/banUsers`,
  unBanUser: `${portApi}/admincheck/unBanUsers`,
    getAllLib: `${portApi}/admincheck/getLibrarian`,
    createAccount: `${portApi}/admincheck/createLibAccount`,
    changePass: `${portApi}/admincheck/changePassForLib`,

    getLogin: `${portApi}/adminnotcheck/loginAdmin`,
    getProfile: `${portApi}/admincheck/profile`,
    changePassword: `${portApi}/admincheck/changePassForLib`,
    createLibrarian: `${portApi}/admincheck/createLibAccount`,




};
export default APIUsers;
