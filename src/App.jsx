import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import useDarkMode from "./hooks/useDarkMode";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";

function App() {
  useDarkMode();
  return (
    <>
      <Router>
        <div className="px-6 min-h-screen  dark:bg-[#18191A] dark:text-white transition duration-500 ease-in-out">
          <Navbar />
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/category/:catgeoryName" element={<Category />} />
            <Route path="/contact/:landlordId" element={<Contact />} />
            <Route
              path="/category/:catgeoryName/:listingId"
              element={<Listing />}
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer theme="dark" />
    </>
  );
}
export default App;
