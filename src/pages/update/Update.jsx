import React, { useContext, useState } from "react";
import "./update.scss";
import * as Yup from "yup";
import { useFormik, FormikProvider, Field, ErrorMessage } from "formik";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import axiosInstance from "../../axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import AddImage from "../../assets/svg/AddImage";
import EditPen from "../../assets/svg/EditPen";
import ClipLoader from "react-spinners/ClipLoader";
import AlertContext from "../../context/alertContext";

const Update = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);
	const { darkMode } = useContext(DarkModeContext);
	const userId = useLocation().pathname.split("/")[2];
	const [, setAlert] = useContext(AlertContext);
	const showAlert = (message, type) => {
		setAlert({
			message,
			type,
		});
	};

	const { userLoading, userErr, data } = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			const response = await axiosInstance.get(`/api/user/${userId}`);
			return response.data;
		},
	});

	console.log(userLoading)
	
	const fillMode = darkMode ? "white" : "black";

	const initialValue = {
		username: data?.info?.Username,
		email: data?.info?.email,
		Bio: data?.info?.Bio,
		city: data?.info?.city,
		website: data?.info?.website,
		instagram: data?.info?.instagram,
		x: data?.info?.x,
		linkedln: data?.info?.linkedln,
	};

	const [profilePic, setProfilePic] = useState(data?.info?.profilePic);
	const [previewProfilePic, setPreviewProfilePic] = useState(
		data?.info?.profilePic && data?.info?.profilePic.length > 1
			? data?.info?.profilePic
			: "Add profile picture",
	);

	const [coverPic, setCoverPic] = useState(data?.info?.coverPic);
	const [previewCoverPic, setPreviewCoverPic] = useState(
		data?.info?.coverPic && data?.info?.coverPic.length > 1
			? data?.info?.coverPic
			: "Add cover picture",
	);

	const handleFileChange = (e, type) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (reader.readyState === 2) {
					if (type === "profilePic") {
						setPreviewProfilePic(reader.result);
						setProfilePic(file);
						formik.setFieldValue("profilePic", file);
					} else {
						setProfilePic(previewProfilePic)
					}

					if (type === "coverPic") {
						setPreviewCoverPic(reader.result);
						setCoverPic(file);
						formik.setFieldValue("coverPic", file);
					}else {
						setCoverPic(previewCoverPic)
					}
				}
			};
			reader.readAsDataURL(file);
		}
	};

	// Define the mutation outside of onSubmit
	const updateProfileMutation = useMutation({
		mutationFn: async (formData) =>
		  await axiosInstance.put("/api/update-User-Profile", formData),
		onSuccess: () => {
		  queryClient.invalidateQueries({ queryKey: ["user", currentUser.id] });
		  navigate(`/profile/${currentUser.id}`);
		},
		onError: (error) => {
		  console.error("Error updating profile:", error);
		},
	  });
	  

	const isLoading = updateProfileMutation.isPending;

	// Validation schema
	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.min(3, "Username must be at least 3 characters long")
			.max(20, "Username cannot exceed 20 characters")
			.required("Username is required"),
		Bio: Yup.string().max(149, "Bio cannot exceed 100 characters"),
		city: Yup.string().max(10, "City cannot exceed 10 characters"),
		website: Yup.string().max(20, "Website cannot exceed 20 characters"),
		x: Yup.string().max(20, "x cannot exceed 20 characters"),
		linkedln: Yup.string().max(30, "LinkedIn cannot exceed 30 characters"),
	});

	const formik = useFormik({
		initialValues: initialValue,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			const formData = new FormData();
			formData.append("username", values.username);
			formData.append("email", values.email);
			formData.append("Bio", values.Bio);
			formData.append("city", values.city);
			formData.append("website", values.website);
			formData.append("instagram", values.instagram);
			formData.append("x", values.x);
			formData.append("linkedln", values.linkedln);

			if (profilePic) {
				formData.append("profilePic", profilePic);
			}

			if (coverPic) {
				formData.append("coverPic", coverPic);
			}

			// Call the mutation
			updateProfileMutation.mutate(formData);
			showAlert("Profile update successful", "success")
		},
	});

	console.log(userErr)

	return (
		<div className="updateProfile">
			{/* <h4>update</h4> */}
			<div className="upProfile">
				<FormikProvider value={formik}>
					<form onSubmit={formik.handleSubmit}>
						<div className="updateCover">
							<div className="coverImage">
								<img
									src={previewCoverPic}
									alt="chosen"
								/>
							</div>
							<div className="coverEditButton">
								<label htmlFor="cover_upload">
									<AddImage
										fill={fillMode}
										width={"50px"}
									/>
								</label>
								<input
									id="cover_upload"
									type="file"
									name="cover"
									accept="image/*"
									onChange={(e) => handleFileChange(e, "coverPic")}
									style={{ display: "none" }}
								/>
							</div>
						</div>
						<div className="updatePfp">
							<div className="pfp">
								<img
									src={previewProfilePic}
									alt="chosen"
									style={{ height: "80px", width: "80px" }}
								/>
							</div>
							<div className="updatePfpBtn">
								<label htmlFor="avatar_upload">
									<EditPen
										fill={fillMode}
										width={"18px"}
									/>
								</label>
								<input
									id="avatar_upload"
									type="file"
									name="avatar"
									accept="image/*"
									onChange={(e) => handleFileChange(e, "profilePic")}
									style={{ display: "none" }}
								/>
							</div>
						</div>

						<div className="userInfoUpdate">
							<div>
								<div className="userInfoInput">
									<label htmlFor="username">Username</label>
									<Field
										className="textInput"
										id="username"
										type="text"
										name="username"
										placeholder="Username"
									/>
								</div>
								<ErrorMessage
									name="username"
									component="div"
									className="errorMsg"
								/>
							</div>
							<div>
								<div className="userInfoInput">
									<label htmlFor="Bio">Bio</label>
									<Field
										className="textInput"
										id="Bio"
										type="text"
										name="Bio"
										placeholder="Bio"
									/>
								</div>
								<ErrorMessage
									name="Bio"
									component="div"
									className="errorMsg"
								/>
							</div>
							<div>
								<div className="userInfoInput">
									<label htmlFor="city">city</label>
									<Field
										className="textInput"
										id="city"
										type="text"
										name="city"
										placeholder="city"
									/>
								</div>
								<ErrorMessage
									name="city"
									component="div"
									className="errorMsg"
								/>
							</div>
							<div>
								<div className="userInfoInput">
									<label htmlFor="website">website</label>
									<Field
										className="textInput"
										id="website"
										type="text"
										name="website"
										placeholder="website"
									/>
								</div>
								<ErrorMessage
									name="website"
									component="div"
									className="errorMsg"
								/>
							</div>
							<div>
								<div className="userInfoInput">
									<label htmlFor="instagram">instagram</label>
									<Field
										className="textInput"
										id="instagram"
										type="text"
										name="instagram"
										placeholder="instagram"
									/>
								</div>
								<ErrorMessage
									name="instagram"
									component="div"
									className="errorMsg"
								/>
							</div>
							<div>
								<div className="userInfoInput">
									<label htmlFor="x">x</label>
									<Field
										className="textInput"
										id="x"
										type="text"
										name="x"
										placeholder="x"
									/>
								</div>
								<ErrorMessage
									name="x"
									component="div"
									className="errorMsg"
								/>
							</div>
							<div>
								<div className="userInfoInput">
									<label htmlFor="linkedln">linkedln</label>
									<Field
										className="textInput"
										id="linkedln"
										type="text"
										name="linkedln"
										placeholder="linkedln"
									/>
								</div>
								<ErrorMessage
									name="linkedln"
									component="div"
									className="errorMsg"
								/>
							</div>
						</div>
						<button
							disabled={isLoading}
							type="submit"
						>
							{isLoading ? (
								<ClipLoader
									color={"grey"}
									size={10}
								/>
							) : (
								"Submit"
							)}
						</button>
					</form>
				</FormikProvider>
			</div>
		</div>
	);
};

export default Update;
