import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import axiosInstance from "../../axios";
import moment from "moment";
import "./message.scss";

const Message = () => {
	const { currentUser } = useContext(AuthContext);

	const { isLoading, error, data } = useQuery({
		queryKey: ["messages", currentUser.id],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get(
					`/api/chat-partners/${currentUser.id}`,
				);
				return response.data;
			} catch (err) {
				throw err;
			}
		},
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="messageList">
			<div>
				{Array.isArray(data.data) &&
					data.data.map((chartPartner) => (
						<Link
							className="partner"
							style={{ textDecoration: "none", color: "inherit" }}
							to={`/message/user/${chartPartner.chatPartnerId}`}
							key={chartPartner.id}
						>
							<div className="partnerProfile">
								<img
									src={chartPartner.profilePic}
									alt=""
								/>
								<span>{chartPartner.name}</span>
							</div>
							<div className="text">
								<p>
									{chartPartner.lastMessage &&
									chartPartner.lastMessage.length > 20
										? chartPartner.lastMessage.substring(0, 20) + "..."
										: chartPartner.lastMessage}
								</p>
							</div>
							<div className="time">
								<p>
									{chartPartner.lastMessage !== null
										? moment(chartPartner.lastMessageCreatedAt).format("h:mmA")
										: "0:00AM"}
								</p>
							</div>
						</Link>
					))}
				<br />
			</div>
		</div>
	);
};

export default Message;
