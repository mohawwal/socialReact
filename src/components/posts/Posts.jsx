import axiosInstance from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "../../skeleton/Skeleton";

const Posts = () => {
	const { isLoading, error, data } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const response = await axiosInstance.get("/api/posts");
			return response.data;
		},
	});
	
	if(error) {
		return(
			<div>{error}</div>
		)
	}
	
	if(isLoading) {
		return (
			<div className="skeletonPosts">
			<Skeleton maxWidth="800px" minWidth="100px" height="300px" borderRadius="20px"/>
			<Skeleton maxWidth="800px" minWidth="100px" height="200px" borderRadius="20px"/>
			<Skeleton maxWidth="800px" minWidth="100px" height="300px" borderRadius="20px"/>
			<Skeleton maxWidth="800px" minWidth="100px" height="200px" borderRadius="20px"/>
		</div>
		)
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
