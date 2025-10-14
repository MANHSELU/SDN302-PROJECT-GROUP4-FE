const portApi = import.meta.env.VITE_APIPORT;
const APIBookLibrarian = {
  getLogin: `${portApi}/api/librarian/notcheck/loginLibrarian`,
  profileUser: `${portApi}/api/librarian/check/profile`,
  deleteBook: `${portApi}/api/librarian/check/deleteBooks`,
  getAllBook: `${portApi}/api/librarian/check/getAllBooks`,
};
export default APIBookLibrarian;
