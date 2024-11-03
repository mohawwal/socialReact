import "./profile.scss";
//import Linkedln from "../../assets/svg/Linkedln"
//import Ig from "../../assets/svg/Ig"
//import X from "../../assets/svg/X"
import Bio from "../../assets/svg/Bio";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
//import Gmail from "../../assets/svg/Gmail"
import UserPost from "../userPost/userPost";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import DarkMode from "../../assets/svg/DarkMode";
import LightMode from "../../assets/svg/LightMode";
import { DarkModeContext } from "../../context/darkModeContext";

const Profile = () => {
	const userId = useLocation().pathname.split("/")[2];
	const { currentUser } = useContext(AuthContext);
	const { darkMode, toggle } = useContext(DarkModeContext);

	const fillMode = darkMode ? "white" : "#222222da";

	const queryClient = useQueryClient();

	const { isLoading, err, data } = useQuery({
		queryKey: ["user"],
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
				`/api/get-followers/${currentUser.id}`,
			);
			return response.data;
		},
	});

	const {
		isLoading: followingLoading,
		err: followingErr,
		data: followingData,
	} = useQuery({
		queryKey: ["followingData", currentUser.id],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/get-Followed-Data/${currentUser.id}`,
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
					currentUser.id
				}`,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rel"] });
		},
	});

	const handleRelationships = () => {
		if (isFollowing) {
			unFollowMutation.mutate();
		} else {
			followMutation.mutate({
				followerUserId: Number(userId),
				followedUserId: currentUser.id,
			});
		}
	};

	if (err || relErr || followingErr) {
		return <>{err.message || relErr.message}</>;
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
								{/* <div className="left">
									{data?.info?.instagram &&
										data?.info?.instagram.length > 0 && (
											<a
												href={`https://instagram.com/${data.info.instagram}`}
												target="_blank"
												rel="noreferrer"
											>
												<Ig width={'25px'}/>
											</a>
										)}
									{data?.info?.x && data?.info?.x.length > 0 && (
										<a
											href={`https://twitter.com/${data.info.x}`}
											target="_blank"
											rel="noreferrer"
										>
											<X width={'25px'}/>
										</a>
									)}
									{data?.info?.linkedln && data?.info?.linkedln.length > 0 && (
										<a
											href={`https://linkedin.com/in/${data.info.linkedln}`}
											target="_blank"
											rel="noreferrer"
										>
											<Linkedln width={'25px'}/>
										</a>
									)}
									{data?.info?.email && data?.info?.email.length > 0 && (
										<a href={`mailto:${data.info.email}`}>
											<Gmail width={'25px'}/>
										</a>
									)}
								</div> */}
								{userId === currentUser?.id.toString() ? (
									<button>
										<Link
											style={{ textDecoration: "none", color: "inherit" }}
											to={`/profile/${userId}/update`}
										>
											Edit Profile
										</Link>
									</button>
								) : (
									<div>
										{isFollowing ? (
											<button onClick={handleRelationships}>UnFollow</button>
										) : (
											<button onClick={handleRelationships}>Follow</button>
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
								<div className="profileUserFollow">
									<span>
										<div>{relData ? relData.length : 0}</div>
										<p>Following</p>
									</span>
									<span>
										<div>{followingData.data ? followingData.data.length : 0}</div>
										<p>Followers</p>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="userPostSection">
					<UserPost
						userId={userId}
						currentUser={currentUser}
						profileData={data}
					/>
				</div>
				<div className="mode">
					{darkMode ? (
						<div
							className="item"
							onClick={toggle}
						>
							<LightMode width={"20px"} />
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
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
