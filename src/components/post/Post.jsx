import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
	const [commentOpen, setCommentOpen] = useState(false);
	const queryClient = useQueryClient();

	const { currentUser } = useContext(AuthContext);

	const { data: commentsData, isLoading: commentsLoading, error: commentsError } = useQuery({
		queryKey: ["comments", post.id],
		queryFn: async () => {
			const response = await axiosInstance.get(`/api/get-comments/?postId=${post.id}`);
			return response.data;
		},
	});

	const handleShare = () => {
		if (navigator.share) {
		  navigator
			.share({
			  title: post.name, 
			  text: post.desc, 
			  url: window.location.href, 
			})
			.then(() => {
			  console.log('Post shared successfully!');
			})
			.catch((err) => {
			  console.error('Error sharing post: ', err);
			});
		} else {
		  console.log('Your browser does not support the Web Share API');
		}
	  };
	  

	const { isLoading, data, error } = useQuery({
		queryKey: ["likes", post.id],
		queryFn: async () => {
			const response = await axiosInstance.get(`/api/get-likes/${post.id}`);
			return response.data;
		},
	});

	const liked = data?.includes(currentUser.id);

	const likeMutation = useMutation({
		mutationFn: (addLike) => axiosInstance.post(`api/add-like`, addLike),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["likes", post.id] });
		},
	});

	const unLikeMutation = useMutation({
		mutationFn: () =>
			axiosInstance.delete(
				`/api/delete-like?userId=${currentUser.id}&postId=${post.id}`,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["likes", post.id] });
		},
	});

	const handleLike = () => {
		if (liked) {
			unLikeMutation.mutate();
		} else {
			likeMutation.mutate({ userId: currentUser.id, postId: post.id });
		}
	};

	if (error || commentsError) {
		return <>{error.message || commentsError.message}</>;
	}

	return (
		<div className="post">
			<div className="container">
				<div className="user">
					<div className="userInfo">
						<img
							src={post.profilePic}
							alt=""
						/>
						<div className="details">
							<Link
								to={`/profile/${post.userId}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<span className="name">{post.username}</span>
							</Link>
							<span className="date">{moment(post.createdAt).fromNow()}</span>
						</div>
					</div>
					<MoreHorizIcon />
				</div>
				<div className="content">
					<p>{post.desc}</p>
					<img
						src={post.img}
						alt=""
					/>
				</div>
				<div className="info">
					<div className="item">
						{isLoading || commentsLoading ? (
							<></>
						) : liked ? (
							<>
								<FavoriteOutlinedIcon
									style={{ color: "red" }}
									onClick={handleLike}
								/>
								<span>{data.length} Likes</span>
							</>
						) : (
							<>
								<FavoriteBorderOutlinedIcon onClick={handleLike} />
								<span>{data.length} Likes</span>
							</>
						)}
					</div>
					<div
						className="item"
						onClick={() => setCommentOpen(!commentOpen)}
					>
						<TextsmsOutlinedIcon />
						{commentsData?.data?.length} Comments
					</div>
					<div className="item" onClick={handleShare}>
						<ShareOutlinedIcon />
						Share
					</div>
				</div>
				{commentOpen && <Comments postId={post.id} />}
			</div>
		</div>
	);
};

export default Post;
