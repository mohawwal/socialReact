import "./rightBar.scss";
import axiosInstance from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const RightBar = () => {
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	const { data, isLoading, err } = useQuery({
		queryKey: ["rel"],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/non-followers/${currentUser.id}`,
			);
			return response.data;
		},
	});

	const {
		data: onlineData,
		isLoading: onlineLoading,
		err: onlineErr,
	} = useQuery({
		queryKey: ["followers"],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/api/get-Followers-Data/${currentUser.id}`,
			);
			return response.data;
		},
	});
	

	const followMutation = useMutation({
		mutationFn: (addFollow) => axiosInstance.post(`api/follow-user`, addFollow),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rel"] });
		},
	});

	const handleRelationships = (userId) => {
		followMutation.mutate({
			followerUserId: Number(userId),
			followedUserId: currentUser.id,
		});
	};

	if (err || onlineErr) {
		return <>{err || onlineErr}</>;
	}

	if (isLoading || onlineLoading) {
		return <>Loading...</>;
	}

	return (
		<div className="rightBar">
			<div className="container">
				<div className="item">
					<span>Suggestions For You</span>
					{data?.data &&
						data?.data?.map((nonFollowers) => {
							return (
								<div
									className="user"
									key={nonFollowers.id}
								>
									<div className="userInfo">
										<img
											src={nonFollowers?.profilePic}
											alt="pic"
										/>
										<span>{nonFollowers?.username}</span>
									</div>
									<div className="buttons">
										<button
											onClick={() => handleRelationships(nonFollowers?.id)}
										>
											follow
										</button>
										{/* <button>dismiss</button> */}
									</div>
								</div>
							);
						})}
				</div>
				{/* <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div> */}
				<div className="item">
					<span>Online Friends</span>
					{onlineData?.data?.map((details) => (
						<div className="user" key={details.id}>
							<div className="userInfo">
								<img
									src={details?.profilePic}
									alt=""
								/>
								<div className="online" />
								<span>{details?.username}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RightBar;
