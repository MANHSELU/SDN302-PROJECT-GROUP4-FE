const portApi = import.meta.env.VITE_APIPORT;
const APIBook = {
  sendMessages: `${portApi}/api/user/check/sendMessage`,
  getMessages: `${portApi}/api/user/check/messageHistory`,
};
export default APIBook;
