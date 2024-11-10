import "./profile.scss";
import Linkedln from "../../assets/svg/Linkedln";
import Ig from "../../assets/svg/Ig";
import X from "../../assets/svg/X";
import Bio from "../../assets/svg/Bio";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import Gmail from "../../assets/svg/Gmail";
import UserPost from "../userPost/userPost";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import BookMark from "../../assets/svg/BookMark";
import Letter from "../../assets/svg/Letter"
import { DarkModeContext } from "../../context/darkModeContext";
import Logout from "../../assets/svg/Logout"
import AlertContext from "../../context/alertContext";

const Profile = () => {
	const userId = useLocation().pathname.split("/")[2];
	const { currentUser } = useContext(AuthContext);
	
	const { darkMode } = useContext(DarkModeContext);
	const fillMode = darkMode ? "#222222da" : "white";

	const { logout } = useContext(AuthContext)
	const [, setAlert] = useContext(AlertContext);

	const showAlert = (message, type) => {
		setAlert({
			message,
			type,
		});
	};

	const queryClient = useQueryClient();

	const { isLoading, err, data } = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			const response = await axiosInstance.get(`/api/user/${userId}`);
			return response.data;
		},
	});

	const {
		isLoading: relLoading,
		err: relErr,
		data: relData,
	} = useQuery({
		queryKey: ["rel"],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/get-followers/${userId}`,
			);
			return response.data;
		},
	});

	const {
		isLoading: followingLoading,
		err: followingErr,
		data: followingData,
	} = useQuery({
		queryKey: ["followingData", userId],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/get-Followed-Data/${userId}`,
			);
			return response.data;
		},
	});

	const isFollowing =
		Array.isArray(relData) && relData.includes(Number(userId));

	const followMutation = useMutation({
		mutationFn: (addFollow) => axiosInstance.post(`api/follow-user`, addFollow),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rel"] });
		},
	});

	const unFollowMutation = useMutation({
		mutationFn: () =>
			axiosInstance.delete(
				`/api/unFollow-user?followerUserId=${Number(userId)}&followedUserId=${
					userId
				}`,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rel"] });
		},
	});

	const handleRelationships = () => {
		if (isFollowing) {
			unFollowMutation.mutate();
			showAlert("User UnFollowed", "warning")
		} else {
			followMutation.mutate({
				followerUserId: Number(userId),
				followedUserId: currentUser.id,
			});
			showAlert("User Followed", "success")
		}
	};

	if (err || relErr || followingErr) {
		return <>{ showAlert(err.message || relErr.message, "success")}</>;
	}

	if (isLoading || relLoading || followingLoading) {
		return <>Loading...</>;
	}

	return (
		<div className="profile">
			<div className="profilePage">
				<div className="profileHeader">
					<div className="images">
						{data?.info?.coverPic && data?.info?.coverPic.length > 0 ? (
							<img
								src={data?.info?.coverPic}
								alt="coverPic"
								className="cover"
							/>
						) : (
							<img
								src={`https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D`}
								alt="coverPic"
								className="cover"
							/>
						)}
						<img
							src={data?.info?.profilePic}
							alt="profilePic"
							className="profilePic"
						/>
					</div>
					<div className="profileContainer">
						<div className="uInfo">
							<div className="profileSocials">
								{userId === currentUser?.id.toString() ? (
									<div className="bookmarkFolder">
										<span>
											<Link to={`/Bookmark`}>
												<BookMark
													fill={"#5271ff"}
													width={"18px"}
												/>
											</Link>
										</span>
										<div>
											<Link
												style={{ textDecoration: "none", color: "inherit" }}
												to={`/profile/${userId}/update`}
											>
												Edit Profile
											</Link>
										</div>
									</div>
								) : (
									<div className="onFoll">
										{isFollowing ? (
											<div className="unFoll">
												<Link className="letterBtn" to={`/message/user/${userId}`}>
													<Letter fill={fillMode} width={'17px'}/>
												</Link>
												<button onClick={handleRelationships}>UnFollow</button>
											</div>
										) : (
											<button className="follBtn" onClick={handleRelationships}>Follow</button>
										)}
									</div>
								)}
							</div>
							<div className="profileUserNames">
								<div>{data?.info?.name}</div>
								<span>@{data?.info?.Username}</span>
							</div>
							<div className="profileUserBio">
								<Bio
									fill={"grey"}
									width={"20px"}
								/>
								<p>{data?.info?.Bio}</p>
							</div>
							<div className="center">
								<div className="info">
									<div>
										{data?.info?.city && data?.info?.city.length > 0 && (
											<div className="item">
												<PlaceIcon
													fontSize="30px"
													color="grey"
												/>
												<span>{data.info.city}</span>
											</div>
										)}
										{/* Website */}
										{data?.info?.website && data?.info?.website.length > 0 && (
											<div className="item">
												<LanguageIcon
													width="25px"
													color="grey"
												/>
												<a
													style={{ textDecoration: "none", color: "inherit" }}
													href={
														data?.info?.website.startsWith("http")
															? data.info.website
															: `http://${data.info.website}`
													}
													target="_blank"
													rel="noreferrer"
												>
													{data.info.website}
												</a>
											</div>
										)}
									</div>
									<div className="left">
										{data?.info?.instagram &&
											data?.info?.instagram.length > 0 && (
												<a
													href={`https://instagram.com/${data.info.instagram}`}
													target="_blank"
													rel="noreferrer"
												>
													<Ig width={"17px"} />
												</a>
											)}
										{data?.info?.x && data?.info?.x.length > 0 && (
											<a
												href={`https://twitter.com/${data.info.x}`}
												target="_blank"
												rel="noreferrer"
											>
												<X width={"17px"} />
											</a>
										)}
										{data?.info?.linkedln &&
											data?.info?.linkedln.length > 0 && (
												<a
													href={`https://linkedin.com/in/${data.info.linkedln}`}
													target="_blank"
													rel="noreferrer"
												>
													<Linkedln width={"17px"} />
												</a>
											)}
										{data?.info?.email && data?.info?.email.length > 0 && (
											<a href={`mailto:${data.info.email}`}>
												<Gmail width={"17px"} />
											</a>
										)}
									</div>
								</div>
								<div className="profileUserFollow">
									<span>
										<div>{relData ? relData.length : 0}</div>
										<p>Following</p>
									</span>
									<span>
										<div>
											{followingData.data ? followingData.data.length : 0}
										</div>
										<p>Followers</p>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="logout" onClick={logout}>
						<p>Logout</p>
						<Logout width={'20px'} fill={'#5271ff'}/>
					</div>
				</div>
				<div className="userPostSection">
					<UserPost
						userId={userId}
						currentUser={currentUser}
						profileData={data}
					/>
				</div>
			</div>
		</div>
	);
};

export default Profile;
