import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { useLocation } from "react-router-dom";
import "./chartText.scss";
import Send from "../../assets/svg/Send";

const ChartText = ({ currentUser }) => {
	const queryClient = useQueryClient();
	const location = useLocation();
	const receiverId = location.pathname.split("/")[3];

	const [text, setText] = useState("");

	const mutation = useMutation({
		mutationFn: (addMessage) =>
			axiosInstance.post("/api/send-message", addMessage),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["messages", currentUser.id, receiverId],
			});
			setText("");
		},
	});

	const handleSendMessage = (e) => {
		e.preventDefault();
		mutation.mutate({ content: text, userId: currentUser.id, receiverId });
	};

	return (
		<div className="ChartText">
			<input
				type="text"
				placeholder="Let us chart..."
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<button onClick={handleSendMessage}>
				<Send
					fill={"grey"}
					width={"30px"}
				/>
			</button>
		</div>
	);
};

export default ChartText;
