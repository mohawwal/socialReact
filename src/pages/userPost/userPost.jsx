import axiosInstance from "../../axios";
//import Post from "../../components/posts/Posts";
import "../../components/posts/posts.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
//import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import moment from "moment";
import "./userPost.scss";
import Delete from "../../assets/svg/Delete";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const UserPost = ({ userId, currentUser, profileData }) => {
	const queryClient = useQueryClient();

	const { darkMode } = useContext(DarkModeContext);
	const fillMode = darkMode ? "white" : "#222222da";

	const { isLoading, error, data } = useQuery({
		queryKey: ["posts", userId?.id],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/all-posts?userId=${userId}`,
			);
			return response.data;
		},
	});

	const deletePostMutation = useMutation({
		mutationFn: async (postId) =>
			await axiosInstance.delete(`/api/delete-post/${postId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	if (error) {
		return <>{error.message}</>;
	}

	if (isLoading) {
		return <>Loading...</>;
	}

	return (
		<div className="userPost">
			{data?.data && data?.data.length > 0 ? (
				data?.data?.map((post) => (
					<div
						className="userPostBling"
						key={post.id}
					>
						<div className="user">
							<div className="userInfo">
								<img
									src={profileData?.info?.profilePic}
									alt=""
								/>
								<div className="details">
									<div
										to={`/profile/${post.userId}`}
										style={{ textDecoration: "none", color: "inherit" }}
									>
										<span className="name">@{profileData?.info?.Username}</span>
									</div>
									<span className="date">
										{moment(post.createdAt).fromNow()}
									</span>
								</div>
							</div>
							<div>
								{userId === currentUser?.id.toString() && (
									<div onClick={() => deletePostMutation.mutate(post.id)}>
										{deletePostMutation.isPending ? (
											<ClipLoader
												color={fillMode}
												size={10}
											/>
										) : (
											<Delete
												fill={fillMode}
												width={"20px"}
											/>
										)}
									</div>
								)}
							</div>
						</div>

						<div className="content">
							<p>{post.desc}</p>
							{post?.img !== null ? (
								<img
									style={{ width: "100%" }}
									src={post?.img}
									alt="post img"
								/>
							) : null}
						</div>
					</div>
				))
			) : (
				<div className="userNoPost">User has not made any post</div>
			)}
		</div>
	);
};

export default UserPost;
