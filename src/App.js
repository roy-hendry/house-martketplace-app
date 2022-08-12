import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Category from "./pages/Category";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Explore />} />
					<Route path="/offers" element={<Offers />} />
					{/* The reason why this is set to categoryName is so that we can use it like a variable and direct user's the rent page or sell page depending on which parameters are given */}
					<Route
						path="/category/:categoryName"
						element={<Category />}
					/>
					<Route path="/profile" element={<PrivateRoute />}>
						{/* This is the outlet referred to when we are in the PrivateRoute component */}
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route
						path="/forgot-password"
						element={<ForgotPassword />}
					/>
				</Routes>
				<Navbar />
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;
