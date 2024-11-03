import "./rightBar.scss";
import axiosInstance from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Search from "../../assets/svg/Search";

const RightBar = ({ darkMode, searchBtn }) => {
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();
	const navigate = useNavigate()

	const goToUserProfile = (userId) => {
		navigate(`/profile/${userId}`)
	}

	const fillMode = darkMode ? "white" : "#222222da";

	const { data, isLoading, err } = useQuery({
		queryKey: ["rel", currentUser.id],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/non-followers/${currentUser.id}`,
			);
			return response.data;
		},
	});

	const {
		data: onlineData,
		isLoading: onlineLoading,
		err: onlineErr,
	} = useQuery({
		queryKey: ["followers"],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/get-Followers-Data/${currentUser.id}`,
			);
			return response.data;
		},
	});

	const followMutation = useMutation({
		mutationFn: (addFollow) => axiosInstance.post(`api/follow-user`, addFollow),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rel"] });
		},
	});

	const handleRelationships = (userId) => {
		followMutation.mutate({
			followerUserId: Number(userId),
			followedUserId: currentUser.id,
		});
	};

	const [keyword, setKeyword] = useState("");

	const {
		data: searchData,
		isLoading: searchLoading,
		error: searchError,
	} = useQuery({
		queryKey: [keyword, "user"],
		queryFn: async () => {
			if (keyword.trim() === "") return [];
			const response = await axiosInstance.get(`/api/users?keyword=${keyword}`);
			return response.data;
		},
	});

	const handleUserClick = () => {
		setKeyword("");
	};

	const isAnyLoading = isLoading || onlineLoading || searchLoading;
	const anyError = err || onlineErr || searchError;

	if (isAnyLoading) return <>Loading...</>;
	if (anyError) return <>Error: {anyError.message}</>;

	return (
		<div className="rightBar">
			<div className="container">
				<div className="search">
					<div
						className="searchBox"
						style={searchBtn ? { border: "blue" } : null}
					>
						<Search
							fill={fillMode}
							className="barIcon"
							width={"14px"}
						/>
						<input
							type="text"
							placeholder="Search..."
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
					</div>
					<div
						className="userList"
						style={
							keyword.trim() !== "" ? { display: "block" } : { display: "none" }
						}
					>
						{isLoading && <div>Loading...</div>}
						{err && <div className="userListErr">Error: {err.message}</div>}
						<ul>
							{searchData?.data && searchData?.data.length > 0 ? (
								searchData?.data.map((user) => (
									<li
										key={user.id}
										onClick={handleUserClick}
									>
										<div
											onClick={() => goToUserProfile(user.id)}
											style={{ textDecoration: "none", color: "inherit" }}
											className="listNames"
										>
											@ {user.Username}
										</div>
									</li>
								))
							) : (
								<li>No users found</li>
							)}
						</ul>
					</div>
				</div>
				<div className="item">
					<span>Suggestions For You</span>
					{data?.data &&
						data?.data?.map((nonFollowers) => {
							return (
								<div
									className="user"
									key={nonFollowers.id}
								>
									<div className="userImg">
										<img
											src={nonFollowers?.profilePic}
											alt="pic"
										/>
										<div>
											<span className="nonFollowersName">
												{nonFollowers?.name}
											</span>
											<p>@{nonFollowers?.username}</p>
										</div>
									</div>
									<div className="buttons">
										<button
											onClick={() => handleRelationships(nonFollowers?.id)}
										>
											follow
										</button>
									</div>
								</div>
							);
						})}
				</div>
				<div className="item">
					<span>Online Friends</span>
					{onlineData?.data?.map((details) => (
						<div
							className="user"
							key={details.id}
						>
							<div className="userInfo">
								<img
									src={details?.profilePic}
									alt=""
								/>
								<div className="online" />
								<div>
									<span className="nonFollowersName">{details?.username}</span>
									<p className="followUsername">@{details?.name}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RightBar;
