const portApi = import.meta.env.VITE_APIPORT;
const APIBook = {
  getBook: `${portApi}/api/user/notcheck/filterPaginated`,
  getCategorylimit: `${portApi}/api/user/notcheck/category`,
  getNewBook: `${portApi}/api/user/notcheck/newBook`,
  getSlotTime: `${portApi}/api/user/check/slottime`,
};
export default APIBook;
