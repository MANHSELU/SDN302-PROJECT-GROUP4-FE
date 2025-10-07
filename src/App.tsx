import { Route, Routes } from 'react-router-dom'
import Header from './component/User/Layout/Header'
import LibraryDashboard from './component/User/Layout/home/home'
import "./App.css"
import Login from './component/User/Layout/Login/Login'
import Footer from './component/User/Layout/Footer'
import Register from './component/User/Layout/Register/Register'
import AllBooks from './component/User/Layout/AllBook/AllBook'
import ProfilePage from './component/User/Layout/Profile/ProfilePage'
import BookDetail from './component/User/Layout/BookDetail/BookDetail'
import FavoriteBooks from './component/User/Layout/FavoriteBooks/FavoriteBooks'
import BorrowHistory from './component/User/Layout/BorrowHistory/BorrowHistory'
import AddBookForm from './component/User/Layout/AddBook/AddBook'
import ViewAllBooksForm from './component/User/Layout/AddBook/ViewAllBooks'
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
            path="/bookdetail/:slug"
            element={
              <>
                <BookDetail />
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
                <BorrowHistory
                />
                <Footer />
              </>
            }
          />
          <Route path="/AddBook" element={<AddBookForm/>}/>
          <Route path="/ViewAllBooks" element={<ViewAllBooksForm/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
