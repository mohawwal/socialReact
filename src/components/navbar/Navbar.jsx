import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
//import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
//import { display } from "@mui/system";

const Navbar = () => {
	const { toggle, darkMode } = useContext(DarkModeContext);
	const { currentUser, logout } = useContext(AuthContext);

	const location = useLocation();
	const profilePage = location.pathname && location.pathname.includes('/profile');

	console.log(profilePage)

	const [keyword, setKeyword] = useState("");

	const { data, isLoading, err } = useQuery({
		queryKey: ["user", keyword],
		queryFn: async () => {
			if (keyword === "") return [];
			const response = await axiosInstance.get(`/api/users?keyword=${keyword}`);
			return response.data;
		},
		enabled: keyword.trim() !== "",
	});

	const handleUserClick = () => {
		setKeyword("");
	};

	return (
		<div className="navbar">
			<div className="left">
				<Link
					to="/"
					style={{ textDecoration: "none" }}
				>
					<span>blingon</span>
				</Link>
				<HomeOutlinedIcon />
				{darkMode ? (
					<WbSunnyOutlinedIcon onClick={toggle} />
				) : (
					<DarkModeOutlinedIcon onClick={toggle} />
				)}
				{/* <GridViewOutlinedIcon /> */}
				<div>
					<div className="search">
						<SearchOutlinedIcon />
						<input
							type="text"
							placeholder="Search..."
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
					</div>
					<div
						style={
							keyword.trim() !== "" ? { display: "block" } : { display: "none" }
						}
					>
						{isLoading && <div>Loading...</div>}
						{err && <div>Error: {err.message}</div>}
						<ul>
							{data?.data && data?.data.length > 0 ? (
								data?.data.map((user) => (
									<li
										key={user.id}
										onClick={handleUserClick}
									>
										<Link to={`/profile/${user.id}`}>{user.name}</Link>
									</li>
								))
							) : (
								<li>No users found</li>
							)}
						</ul>
					</div>
				</div>
			</div>
			<div className="right">
				<Link to={`/profile/${currentUser.id}`}>
					<PersonOutlinedIcon />
				</Link>
				<EmailOutlinedIcon />
				<NotificationsOutlinedIcon />
				<div className="user">
					<img
						src={currentUser.profilePic}
						alt=""
					/>
					<span>{currentUser.name}</span>
				</div>
			</div>
			<div>
				{currentUser !== null && profilePage ? <button onClick={() => logout()}>Logout</button> : null}
			</div>
		</div>
	);
};

export default Navbar;
