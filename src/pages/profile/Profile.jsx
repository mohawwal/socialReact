import "./profile.scss";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import UserPost from "../userPost/userPost";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
	const userId = useLocation().pathname.split("/")[2];
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient()

	const { isLoading, err, data } = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/api/user/${userId}`);
			return response.data;
		},
	});

	const { isLoading: relLoading, err: relErr, data: relData } = useQuery({
		queryKey: ["rel"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/api/get-followers/${currentUser.id}`);
			return response.data;

		},
	});
	
	const isFollowing = Array.isArray(relData) && relData.includes(Number(userId))

	const followMutation = useMutation({
		mutationFn: (addFollow) => axiosInstance.post(`api/follow-user`, addFollow),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rel"] });
		},
	});

	const unFollowMutation = useMutation({
		mutationFn: () =>
			axiosInstance.delete(
				`/api/unFollow-user?followerUserId=${Number(userId)}&followedUserId=${currentUser.id}`,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rel"] });
		},
	});

	const handleRelationships = () => {

		if (isFollowing) {
			unFollowMutation.mutate();
		} else {
			followMutation.mutate({ followerUserId: Number(userId), followedUserId: currentUser.id });
		}
	}

	if (err || relErr) {
		return <>{err.message || relErr.message}</>;
	}

	if (isLoading || relLoading) {
		return <>Loading...</>;
	}

	return (
		<div className="profile">
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
					<div className="left">
						{/* Instagram */}
						{data?.info?.instagram && data?.info?.instagram.length > 0 && (
							<a
								href={`https://instagram.com/${data.info.instagram}`}
								target="_blank"
								rel="noreferrer"
							>
								<InstagramIcon fontSize="large" />
							</a>
						)}
						{/* Twitter (X) */}
						{data?.info?.x && data?.info?.x.length > 0 && (
							<a
								href={`https://twitter.com/${data.info.x}`}
								target="_blank"
								rel="noreferrer"
							>
								<TwitterIcon fontSize="large" />
							</a>
						)}
						{/* LinkedIn */}
						{data?.info?.linkedn && data?.info?.linkedn.length > 0 && (
							<a
								href={`https://linkedin.com/in/${data.info.linkedn}`}
								target="_blank"
								rel="noreferrer"
							>
								<LinkedInIcon fontSize="large" />
							</a>
						)}
						{/* Gmail */}
						{data?.info?.email && data?.info?.email.length > 0 && (
							<a href={`mailto:${data.info.email}`}>
								<EmailOutlinedIcon fontSize="large" />
							</a>
						)}
					</div>
					<div className="center">
						<span>{data?.info?.name}</span>
						<div className="info">
							{/* City */}
							{data?.info?.city && data?.info?.city.length > 0 && (
								<div className="item">
									<PlaceIcon />
									<span>{data.info.city}</span>
								</div>
							)}
							{/* Website */}
							{data?.info?.website && data?.info?.website.length > 0 && (
								<div className="item">
									<LanguageIcon />
									<a
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
						{userId === currentUser?.id.toString() ? (
							<button>Update</button>
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
				</div>
				<UserPost userId={userId} />
			</div>
		</div>
	);
};

export default Profile;
