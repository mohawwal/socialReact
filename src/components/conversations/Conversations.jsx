import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../axios";
import "./conversations.scss";
import moment from "moment";

const Conversations = ({ currentUser }) => {
	const location = useLocation();
	const receiverId = location.pathname.split("/")[3];

	const {
		isLoading,
		error,
		data: messageData,
	} = useQuery({
		queryKey: ["messages", currentUser.id, receiverId],
		queryFn: async () => {
			try {
				const response = await axiosInstance.get(
					`/api/get-message?userId1=${currentUser.id}&userId2=${receiverId}`,
				);
				return response.data;
			} catch (err) {
				throw err;
			}
		},
	});

	if (isLoading) {
		return <>Loading</>;
	}

	if (error) {
		return <div>Err</div>;
	}

	if (!messageData || !Array.isArray(messageData.data)) {
		return <div>No messages available</div>;
	}

	return (
		<div className="conversations">
			{messageData.data.map((message) => (
				<div
					key={message.id}
					className={`message ${
						message.senderId === currentUser.id ? "sender" : "receiver"
					}`}
				>
					<div className="messageContent">{message.content}</div>
					<div className="messageTime">
						{moment(message.createdAt).format("h:mmA")}
					</div>
				</div>
			))}
		</div>
	);
};

export default Conversations;
