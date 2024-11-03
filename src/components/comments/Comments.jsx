import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
	console.log(postId);
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	const [comment, setComment] = useState("");

	const { isLoading, data, err } = useQuery({
		queryKey: ["comments"],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/get-comments?postId=${postId}`,
			);
			return response.data;
		},
	});

  console.log(err)

	const mutation = useMutation({
		mutationFn: (addComment) =>
			axiosInstance.post("/api/add-comments", addComment),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
			setComment("");
		},
	});

  const comments = data?.data || [];

	const handleComment = (e) => {
		e.preventDefault();
		mutation.mutate({ desc: comment, postId });
	};
	return (
		<div className="comments">
			<div className="write">
				<img
					src={currentUser.profilePic}
					alt=""
				/>
				<input
					type="text"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="write a comment"
				/>
				<button onClick={handleComment}>Post</button>
			</div>
			{isLoading ? (
				<>Loading...</>
			) : (
				comments?.map((comment) => (
					<div
						className="comment"
						key={comment.id}
					>
						<img
							src={comment.profilePic}
							alt=""
						/>
						<div className="info">
							<span>{comment.name}</span>
							<p>{comment.desc}</p>
						</div>
						<span className="date">{moment(comment.createdAt).fromNow()}</span>
					</div>
				))
			)}
		</div>
	);
};

export default Comments;
