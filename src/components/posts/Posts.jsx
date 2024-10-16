import axiosInstance from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";

const Posts = () => {
	const { isLoading, error, data } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const response = await axiosInstance.get("/api/posts");
			return response.data;
		},
	});
	console.log("err -", error);

	if (isLoading) {
		return <>Loading...</>;
	}

	return (
		<div className="posts">
			{data?.data && data?.data.length > 0 ? (
				data?.data?.map((post) => (
					<Post
						key={post.id}
						post={post}
					/>
				))
			) : (
				<div>No posts available.</div>
			)}
		</div>
	);
};

export default Posts;
