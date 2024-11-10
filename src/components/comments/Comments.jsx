import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import moment from "moment";
import AlertContext from "../../context/alertContext";


const Comments = ({ postId }) => {
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	const [, setAlert] = useContext(AlertContext);
	const showAlert = (message, type) => {
		setAlert({
			message,
			type,
		});
	};

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


	const mutation = useMutation({
		mutationFn: (addComment) =>
			axiosInstance.post("/api/add-comments", addComment),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments"] });
			setComment("");
			showAlert("comment added", "success")
		},
	});

  const comments = data?.data || [];

	const handleComment = (e) => {
		e.preventDefault();
		mutation.mutate({ desc: comment, postId });
	};

	if(err) {
		return(
			showAlert(err, "error")
		)
	}
	return (
		<div className="comments">
			<div className="write">
				<div className="writeImg">
					<img
						src={currentUser.profilePic}
						alt=""
					/>
				</div>
				<div className="writeInput">
					<input
						type="text"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="write a comment"
					/>
				</div>
				<div className="writeBtn">
					<button onClick={handleComment}>Post</button>
				</div>
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
