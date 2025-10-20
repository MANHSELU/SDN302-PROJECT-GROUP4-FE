import { Route, Routes } from "react-router-dom";
import Header from "./component/User/Layout/Header";
import LibraryDashboard from "./component/User/Layout/home/home";
import "./App.css";
import Login from "./component/User/Layout/Login/Login";
import Footer from "./component/User/Layout/Footer";
import Register from "./component/User/Layout/Register/Register";
import AllBooks from "./component/User/Layout/AllBook/AllBook";
import ProfilePage from "./component/User/Layout/Profile/ProfilePage";
import BookDetail from "./component/User/Layout/BookDetail/BookDetail";
import FavoriteBooks from "./component/User/Layout/FavoriteBooks/FavoriteBooks";
import BorrowHistory from "./component/User/Layout/BorrowHistory/BorrowHistory";
import OrderTablePage from "./component/User/Layout/OrderTablePage/OrderTablePage";
import ChatPage from "./component/User/Layout/ChatPage/ChatPage";
import ChatPageLibrarian from "./component/Librarian/Layout/ChatPage/chatPage";
import BookingTablePage from "./component/User/Layout/BookingTable/BookingTablePage";
import LoginLibrarian from "./component/Librarian/Layout/Login/Login";
import HeaderLibrarian from "./component/Librarian/Layout/Header";
import HomeLibrarian from "./component/Librarian/Layout/home/home";
import SanphamList from "./component/Librarian/Layout/AllBook/AllBook";
import TableList from "./component/Librarian/Layout/BookingTable/BookingTablePage";
import ListBookOrder from "./component/Librarian/Layout/ListTableOrders/ListBookOrders";
import BookListBorrow from "./component/Librarian/Layout/BookListBorrowHistory/BorrowHistory";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Header />}>
          <Route
            path="/"
            element={
              <>
                <LibraryDashboard />
                <Footer />
              </>
            }
          />
          <Route
            path="/book"
            element={
              <>
                <AllBooks />
                <Footer />
              </>
            }
          />

          <Route
            path="/bookingtable"
            element={
              <>
                <BookingTablePage />
                <Footer />
              </>
            }
          />
          <Route
            path="/bookdetail/:slug"
            element={
              <>
                <BookDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/ordertable"
            element={
              <>
                <OrderTablePage />
                <Footer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <ProfilePage />
                <Footer />
              </>
            }
          />
          <Route
            path="/favoritebooks"
            element={
              <>
                <FavoriteBooks />
                <Footer />
              </>
            }
          />
          <Route
            path="/borrowhistory"
            element={
              <>
                <BorrowHistory />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chatPage" element={<ChatPage />} />
        </Route>
        <Route
          path="/LoginLibrarian"
          element={
            <>
              <LoginLibrarian />
            </>
          }
        />
        <Route
          path="/librarian"
          element={
            <>
              <HeaderLibrarian />
            </>
          }
        >
          <Route
            path="bookinglist/table"
            element={
              <>
                <ListBookOrder />
              </>
            }
          />
          <Route
            path="home"
            element={
              <>
                <HomeLibrarian />
              </>
            }
          />
          <Route
            path="getallbook"
            element={
              <>
                <SanphamList />
              </>
            }
          />
          <Route
            path="getalltable"
            element={
              <>
                <TableList />
              </>
            }
          />
          <Route
            path="tableListBorrow"
            element={
              <>
                <BookListBorrow />
              </>
            }
          />
        </Route>
        <Route path="/loginLibrarian" element={<LoginLibrarian />} />
        <Route path="/chatPageLibrarian" element={<ChatPageLibrarian />} />
      </Routes>
    </>
  );
}

export default App;
