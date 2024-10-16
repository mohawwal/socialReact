import axiosInstance from "../../axios";
//import Post from "../../components/posts/Posts";
import "../../components/posts/posts.scss";
import { useQuery } from "@tanstack/react-query";
//import ClipLoader from "react-spinners/ClipLoader";
//import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const UserPost = ({userId}) => {

	const { isLoading, error, data } = useQuery({
		queryKey: ["posts", userId?.id],
		queryFn: async () => {
            const response = await axiosInstance.get(`/api/all-posts?userId=${userId}`);
            return response.data;
		},
	});


    if(error) {
        return <>{error.message}</>
    }

	if (isLoading) {
		return <>Loading...</>
	}

	return (
		<div className="posts">
			{data?.data && data?.data.length > 0 ? (
				data?.data?.map((post) => (
					<div key={post.id}>
                        <p>{post.desc}</p>
                    </div>
				))
			) : (
				<div>You have not made any post</div>
			)}
		</div>
	);
};

export default UserPost;
