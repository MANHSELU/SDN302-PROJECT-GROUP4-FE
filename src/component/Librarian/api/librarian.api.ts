const portApi = import.meta.env.VITE_APIPORT;
const APITableLibranrian = {
  APISendMessage: `${portApi}/api/librarian/check/sendMessages`,
  APIGetMessage: `${portApi}/api/librarian/check/messageHistories`,
  APIGetConversations: `${portApi}/api/librarian/check/getAllConversations`,
};
export default APITableLibranrian;
