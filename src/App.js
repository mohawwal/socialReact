import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
	createBrowserRouter,
	RouterProvider,
	//Route,
	Outlet,
	Navigate,
} from "react-router-dom";
//import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Update from "./pages/update/Update";
import NavDown from "./components/navDown/NavDown";
import Bookmarks from "./components/Bookmarks/Bookmarks";
import Message from "./pages/message/Message";
import Chart from "./components/chart/Chart";
import SearchSection from "./components/searchSection/SearchSection";


function App() {
	const { currentUser } = useContext(AuthContext);

	const { darkMode, toggle } = useContext(DarkModeContext);

	const queryClient = new QueryClient();

	const Layout = () => {
		return (
			<QueryClientProvider client={queryClient}>
				<div
					className={`theme-${darkMode ? "dark" : "light"}`}
					style={{ width: "100%" }}
				>
					<div className="body">
						<div
							style={{
								height: "100vh",
								display: "flex",
								flexDirection: "row",
								width: "100%",
								maxWidth: "1200px",
								margin: "0px auto",
							}}
						>
							<div className="leftBarSection">
								<LeftBar
									darkMode={darkMode}
									toggle={toggle}
								/>
							</div>
							<div className="outletSection">
								<Outlet />
								<div className="navDown">
									<NavDown
										darkMode={darkMode}
										toggle={toggle}
									/>
								</div>
							</div>
							<div className="rightBarSection">
								<RightBar darkMode={darkMode} />
							</div>
						</div>
					</div>
				</div>
			</QueryClientProvider>
		);
	};

	const ProtectedRoute = ({ children }) => {
		const token = localStorage.getItem("token");
		if (!currentUser && !token) {
			return <Navigate to="/login" />;
		}

		return children;
	};

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<ProtectedRoute>
					<Layout />
				</ProtectedRoute>
			),
			children: [
				{
					path: "/",
					element: <Home />,
				},
				{
					path: "/profile/:id",
					element: <Profile />,
				},
				{
					path: "/profile/:id/update",
					element: <Update />,
				},
				{
					path: "/Bookmark",
					element: <Bookmarks />,
				},
				{
					path: "/message",
					element: <Message />,
				},{
					path: "/message/user/:receiverId",
					element: <Chart />,
				},
				{
					path: "/search",
					element: <SearchSection />,
				},
			],
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/register",
			element: <Register />,
		},
	]);

	return (
		<div>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
