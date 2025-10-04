const portApi = import.meta.env.VITE_APIPORT;
const APIAuthor = {
  getAthour: `${portApi}/api/user/notcheck/getauthor`,
  getLogin: `${portApi}/api/user/notcheck/loginUser`,
  profileUser: `${portApi}/api/user/check/getuser`,
  updateProfile: `${portApi}/api/user/check/profile`,
  changePassword: `${portApi}/api/user/check/profile/password`,
};
export default APIAuthor;
