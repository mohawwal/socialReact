import React, { useContext } from "react";
import { BookmarkContext } from "../../context/bookmarkContext";
import moment from "moment";
import "./bookmark.scss";
import BookMark from "../../assets/svg/BookMark";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import { Link } from "react-router-dom";

const Bookmarks = () => {
	const { bookmarks, handleBookmark } = useContext(BookmarkContext);

	const { isLoading, error, data } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const response = await axiosInstance.get("/api/posts");
			return response.data.data;
		},
	});
	console.log("err -", error);
	console.log("data -", data);

	if (isLoading) {
		return <>Loading...</>;
	}
	return (
		<div className="bookmarkPost">
			<div className="marks">
				{bookmarks.map((bookmark) => (
					<div className="bookmark">
						<div className="user">
							<div className="userInfo">
								<img
									src={bookmark?.profilePic}
									alt=""
								/>
								<div className="details">
									<Link
										to={`/profile/${bookmark?.id}`}
										style={{ textDecoration: "none", color: "inherit" }}
									>
										<span className="name">{bookmark?.username}</span>
									</Link>
									<span className="date">
										{moment(bookmark?.createdAt).fromNow()}
									</span>
								</div>
							</div>
						</div>
						<div className="content">
							<p>{bookmark?.desc}</p>
							<img
								src={bookmark?.img}
								alt=""
							/>
						</div>
						<div className="bookmarkBtn">
							<div
								className="item"
								onClick={() => handleBookmark(bookmark)}
							>
								<BookMark
									fill={"#5271ff"}
									width={"20px"}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Bookmarks;
