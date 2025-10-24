const portApi = import.meta.env.VITE_APIPORT;
const APIBook = {
  getBook: `${portApi}/api/user/notcheck/filterPaginated`,
  getCategorylimit: `${portApi}/api/user/notcheck/category`,
  getNewBook: `${portApi}/api/user/notcheck/newBook`,
  getSlotTime: `${portApi}/api/user/check/slottime`,
  getBookDEtail: `${portApi}/api/user/notcheck/books`,
  postBook: `${portApi}/api/user/check/borrowBook`,
  getFavourite: `${portApi}/api/user/check/favourite`,
  addFavourite: `${portApi}/api/user/check/favourite`,
  removeFavourite: (bookId: string) =>
    `${portApi}/api/user/check/favourite/${bookId}`,
  getOrderBook: `${portApi}/api/user/check/orderbook`,
  addReview: `${portApi}/api/user/check/reviewBook`,
  getReview: `${portApi}/api/user/notcheck/reviewBook`,
};

export default APIBook;
