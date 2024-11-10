import "./share.scss";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axios";
import ClipLoader from "react-spinners/ClipLoader";
import Cancel from '../../assets/svg/Cancel'

const Share = () => {
	const { currentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	const [desc, setDesc] = useState("");
	const [descWarning, setDescWarning] = useState("");
	const [postImg, setPostImg] = useState(null);
	const [postImgPreview, setPostImgPreview] = useState(null);


	// Reference to the file input
	const fileInputRef = useRef(null);

	const mutation = useMutation({
		mutationFn: (newPost) => axiosInstance.post("/api/add-post", newPost),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			setDesc("");
			setPostImg(null);
			setPostImgPreview(null);
		},
	});

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setPostImg(file);
			setPostImgPreview(URL.createObjectURL(file));
		}
	};

	
	const cancelPrevPostImg = () => {
		setPostImg(null);
		setPostImgPreview(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleDescChange = (e) => {
		const input = e.target.value;

		if (input.length <= 150) {
			setDescWarning("");
			setDesc(input);
		} else {
			setDescWarning("Character limit of 150 exceeded!");
		}
	};

	// Handle form submission
	const handleClick = () => {
		const formData = new FormData();
		formData.append("desc", desc);
		formData.append("img", postImg);

		mutation.mutate(formData);
	};

	const isLoading = mutation.isPending;

	return (
		<div className="share">
			<div className="container">
				<div className="top">
					<img src={currentUser.profilePic} alt="" />
					<div className="comment">
						<textarea
							value={desc}
							placeholder={`What's on your mind ${currentUser.Username}?`}
							onChange={handleDescChange}
						/>
						{descWarning && <p className="warning">{descWarning}</p>}
						{postImgPreview && (
							<div className="sharePreviewImg">
								<img
									src={postImgPreview}
									alt="Selected post"
									style={{
										maxWidth: "500px",
										marginTop: "5px",
										backgroundColor: "red",
									}}
								/>
								<button onClick={cancelPrevPostImg}>
									<Cancel width={'20px'}/>
								</button>
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
							ref={fileInputRef} 
						/>
						<label htmlFor="file">
							<div className="item">
								<span>Add Image</span>
							</div>
						</label>
					</div>
					<div className="right">
						{isLoading ? (
							<ClipLoader color={"white"} size={16} />
						) : (
							<button disabled={isLoading} onClick={handleClick}>
								Bling
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Share;