import "./share.scss";
import Image from "../../assets/img.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import ClipLoader from "react-spinners/ClipLoader";

const Share = () => {
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	const [desc, setDesc] = useState("");
	const [postImg, setPostImg] = useState(null);
	const [postImgPreview, setPostImgPreview] = useState(null);

	const mutation = useMutation({
		mutationFn: (newPost) => axiosInstance.post("/api/add-post", newPost),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			setDesc("");
			setPostImg(null);
			setPostImgPreview(null);
		},
	});

	// Handle image selection and create preview
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setPostImg(file);
			setPostImgPreview(URL.createObjectURL(file));
		}
	};

	// Handle form submission
	const handleClick = () => {
		const formData = new FormData();
		formData.append("desc", desc);
		formData.append("img", postImg);

		// for (let [key, value] of formData.entries()) {
		// 	console.log(key, value);
		// }
		mutation.mutate(formData);
	};

	const isLoading = mutation.isLoading;

	return (
		<div className="share">
			<div className="container">
				<div className="top">
					<img
						src={currentUser.profilePic}
						alt=""
					/>
					<div className="comment">
						<input
							type="text"
							value={desc}
							placeholder={`What's on your mind ${currentUser.name}?`}
							onChange={(e) => setDesc(e.target.value)}
						/>
						{postImgPreview && (
							<div>
								<img
									src={postImgPreview}
									alt="Selected post"
									style={{
										maxWidth: "500px",
										marginTop: "10px",
										backgroundColor: "red",
									}}
								/>
							</div>
						)}
					</div>
				</div>
				<hr />
				<div className="bottom">
					<div className="left">
						<input
							type="file"
							id="file"
							style={{ display: "none" }}
							onChange={handleImageChange}
						/>
						<label htmlFor="file">
							<div className="item">
								<img
									src={Image}
									alt=""
								/>
								<span>Add Image</span>
							</div>
						</label>
					</div>
					<div className="right">
						{isLoading ? (
							<ClipLoader
								color={"white"}
								size={20}
							/>
						) : (
							<button
								disabled={isLoading}
								onClick={handleClick}
							>
								Share
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Share;
