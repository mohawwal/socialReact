import { createContext, useState, useCallback, useContext } from "react";
import AlertContext from "./alertContext";


export const BookmarkContext = createContext();

export const BookmarkContextProvider = ({ children }) => {
	const [, setAlert] = useContext(AlertContext);

	
	const [bookmarks, setBookmarks] = useState(
		JSON.parse(localStorage.getItem("bookmarkedPosts")) || [],
	);

	const handleBookmark = useCallback(
		(post) => {
			const showAlert = (message, type) => {
				setAlert({
					message,
					type,
				});
			};
			
			const simplifiedPost = {
				id: post.id,
				desc: post.desc,
				img: post.img,
				profilePic: post.profilePic,
				name: post.name,
				username: post.username,
				userId: post.userId,
				createdAt: post.createdAt,
			}

			const isPostBookmarked = bookmarks.some(
				(savedPosts) => savedPosts.id === post.id,
			);

			let updatedBookmarks;
			if (isPostBookmarked) {
				updatedBookmarks = bookmarks.filter(
					(savedPosts) => savedPosts.id !== post.id,
				);
				showAlert("Post removed from Bookmarked", "warning")
			} else {
				updatedBookmarks = [...bookmarks, simplifiedPost];
				showAlert("Post Bookmarked", "success")
			}

			localStorage.setItem("bookmarkedPosts", JSON.stringify(updatedBookmarks));
			setBookmarks(updatedBookmarks);
		},
		[bookmarks, setAlert],
	);

	return (
		<BookmarkContext.Provider value={{ handleBookmark, bookmarks }}>
			{children}
		</BookmarkContext.Provider>
	);
};
