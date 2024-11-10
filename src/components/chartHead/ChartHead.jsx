import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { Link } from "react-router-dom";
import "./chartHead.scss";

const ChartHead = () => {
	const location = useLocation();
	const userId = location.pathname.split("/")[3];

	const { isLoading, err, data } = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			const response = await axiosInstance.get(`/api/user/${userId}`);
			return response.data;
		},
	});

	if (isLoading) <>loading</>;

	if (err) <>{err}</>;

	return (
		<div className="ChartHead">
			<div>
				<img
					src={data?.info.profilePic}
					alt=""
				/>
				<Link
          className="chartUser"
					to={`/profile/${data?.info.id}`}
					style={{ textDecoration: "none", color: "inherit" }}
				>
					<p>{data?.info.Username}</p>
				</Link>
			</div>
		</div>
	);
};

export default ChartHead;
