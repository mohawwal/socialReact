import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/svg/Logo";
import Home from "../../assets/svg/Home";
import Search from "../../assets/svg/Search";
import Message from "../../assets/svg/Message";
import BookMark from "../../assets/svg/BookMark";
import Community from "../../assets/svg/Community";
import Portfolio from "../../assets/svg/Portfolio";
import More from "../../assets/svg/More";
import Post from "../../assets/svg/Post";
import DarkMode from "../../assets/svg/DarkMode";
import LightMode from "../../assets/svg/LightMode";
import { SearchContext } from "../../context/searchContext";

const LeftBar = ({ darkMode, toggle }) => {
	const { currentUser } = useContext(AuthContext);
	const { handleSearchToggleFunc } = useContext(SearchContext)
	const fillMode = darkMode ? "white" : "#222222da";

	return (
		<div className="leftBar">
			<div className="container">
				<div className="upBarList">
					<Link
						style={{ textDecoration: "none", color: "inherit" }}
						to="/"
						className="logoBar"
					>
						<Logo
							className="barIcon"
							fill={fillMode}
							width={"60px"}
						/>
					</Link>
					<div className="menu">
						<Link
							style={{ textDecoration: "none", color: "inherit" }}
							className="item"
						>
							<Home
								className="barIcon"
								fill={fillMode}
								width={"20px"}
							/>
							<span>Home</span>
						</Link>
						<div
							className="item"
							onClick={handleSearchToggleFunc}
						>
							<Search
								className="barIcon"
								fill={fillMode}
								width={"20px"}
							/>
							<span>Search</span>
						</div>
						<Link
							style={{ textDecoration: "none", color: "inherit" }}
							className="item"
						>
							<Message
								className="barIcon"
								fill={fillMode}
								width={"20px"}
							/>
							<span>Messages</span>
						</Link>
						<Link
							to='/BookMark'
							style={{ textDecoration: "none", color: "inherit" }}
							className="item"
						>
							<BookMark
								className="barIcon"
								fill={fillMode}
								width={"20px"}
							/>
							<span>BookMark</span>
						</Link>
						<Link
							style={{ textDecoration: "none", color: "inherit" }}
							className="item"
						>
							<Portfolio
								className="barIcon"
								fill={fillMode}
								width={"20px"}
							/>
							<span>Portfolio</span>
						</Link>
						<Link
							style={{ textDecoration: "none", color: "inherit" }}
							className="item"
						>
							<Community
								className="barIcon"
								fill={fillMode}
								width={"20px"}
							/>
							<span>Community</span>
						</Link>
						{darkMode ? (
							<div
								className="item"
								onClick={toggle}
							>
								<LightMode width={"20px"} />
								<span>Light Mode</span>
							</div>
						) : (
							<div
								className="item"
								onClick={toggle}
							>
								<DarkMode
									width={"20px"}
									fill={fillMode}
								/>
								<span>Dark Mode</span>
							</div>
						)}
						<div className="item">
							<More
								className="barIcon"
								fill={fillMode}
								width={"20px"}
							/>
							<span>More</span>
						</div>
					</div>
				</div>

				<div className="downBarList">
					<div className="postItem">
						<span>Post</span>
						<Post width={"20px"} />
					</div>

					<Link
						style={{ textDecoration: "none", color: "inherit" }}
						to={`profile/${currentUser?.id}`}
						className="userImg"
					>
						<img
							src={currentUser?.profilePic}
							alt=""
						/>
						<div>
							<span>{currentUser?.name}</span>
							<p>@{currentUser?.Username}</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LeftBar;
