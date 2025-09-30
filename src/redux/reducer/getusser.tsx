// redux/reducer/getuser.js
// lưu ý một điều là redux chỉ giữ lại giá trị gần nhất mà nó đã lưu vào chương trình này
// có thể dùng để lưu như là profile ...
type Action =
  | { type: "getuser"; payload: object }
  | { type: "checklogin"; payload: boolean }
  | { type: "logout" };
export interface State {
  user: object;
  isLoggedIn: boolean;
}
//: state là kiểu trả về
const initialState: State = {
  user: {},
  isLoggedIn: false,
};


// : state là dùng để return giống như state đã khai báo, (...): tham số đã khai báo
const getuser = (state = initialState, action: Action): State => {
  switch (action.type) {
    case "getuser":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case "checklogin":
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case "logout":
      return {
        ...state,
        user: {}, // hoặc null
      };
    default:
      return state;
  }
};

export default getuser;
