import React from "react";
import "./navDown.scss";
import { Link } from "react-router-dom";
import Home from "../../assets/svg/Home";
import Search from "../../assets/svg/Search";
import AddPost from "../../assets/svg/AddPost";
import Message from "../../assets/svg/Message";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import axiosInstance from "../../axios";
import { SearchContext } from "../../context/searchContext";

const NavDown = ({ darkMode }) => {
	const fillMode = darkMode ? "white" : "#222222da";
	const { currentUser } = useContext(AuthContext);
	const { handleSearchToggleFunc } = useContext(SearchContext);

	const { err, data } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/api/user/${currentUser.id}`);
			return response.data;
		},
	});

	if (err) {
		return <div>{err}</div>;
	}

	return (
		<div className="navDown">
			<ul>
				<li>
					<Link to={"/"}>
						<Home
							fill={fillMode}
							width={"16.5px"}
						/>
					</Link>
				</li>
				<li onClick={handleSearchToggleFunc}>
					<Search
						fill={fillMode}
						width={"18px"}
					/>
				</li>
				<li>
					<AddPost
						fill={fillMode}
						width={"18px"}
					/>
				</li>
				<li>
					<Message
						fill={fillMode}
						width={"18px"}
					/>
				</li>
				<Link to={`profile/${currentUser?.id}`}>
					<li style={{ width: "20px", height: "20px" }}>
						<img
							src={data?.info?.profilePic}
							alt="profilePic"
							className="profilePic"
							style={{
								width: "100%",
								borderRadius: "50%",
								border: "1px solid lightBlue",
							}}
						/>
					</li>
				</Link>
			</ul>
		</div>
	);
};

export default NavDown;
