export const getUer = (data: object) => {
  return {
    type: "getuser",
    payload: data,
  };
};
export const checklogin = (data: object) => {
  return {
    type: "checklogin",
    payload: data,
  };
};
export const logout = () => {
  return {
    type: "logout",
  };
}
