import React, { useContext, useState } from "react";
import * as Yup from "yup";
import { useFormik, FormikProvider, Field, ErrorMessage } from "formik";
import { AuthContext } from "../../context/authContext";
import axiosInstance from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"

const Update = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate()
	const { currentUser } = useContext(AuthContext);

	const initialValue = {
		username: currentUser?.Username,
		email: currentUser?.email,
		Bio: currentUser?.Bio,
		city: currentUser?.city,
		website: currentUser?.website,
		instagram: currentUser?.instagram,
		x: currentUser?.x,
		linkedln: currentUser?.linkedln,
	};

	const [profilePic, setProfilePic] = useState(null);
	const [previewProfilePic, setPreviewProfilePic] = useState(
		currentUser?.profilePic && currentUser?.profilePic.length > 1
			? currentUser?.profilePic
			: "Add profile picture"
	);

	const [coverPic, setCoverPic] = useState(null);
	const [previewCoverPic, setPreviewCoverPic] = useState(
		currentUser?.coverPic && currentUser?.coverPic.length > 1
			? currentUser?.coverPic
			: "Add cover picture"
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
					} else if (type === "coverPic") {
						setPreviewCoverPic(reader.result);
						setCoverPic(file);
						formik.setFieldValue("coverPic", file);
					}
				}
			};
			reader.readAsDataURL(file);
		}
	};
	
	// Define the mutation outside of onSubmit
	const updateProfileMutation = useMutation({
		mutationFn: async (formData) => await axiosInstance.put("/api/update-User-Profile", formData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			navigate(`/profile/${currentUser.id}`);
		},
		onError: (error) => {
			console.error("Error updating profile:", error);
		},
	});

	const isLoading = updateProfileMutation.isLoading;

	// Validation schema
	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.min(3, "Username must be at least 3 characters long")
			.max(20, "Username cannot exceed 20 characters")
			.required("Username is required"),
		Bio: Yup.string().max(100, "Bio cannot exceed 100 characters"),
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
		},
	});


	return (
		<div>
			<h4>update</h4>
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<div>
						<div>
							<img
								src={previewProfilePic}
								alt="chosen"
								style={{ height: "100px", width: "100px" }}
							/>
						</div>
						<div className="editCA">
							<label htmlFor="avatar_upload">Choose profile picture</label>
							<input
								type="file"
								name="avatar"
								accept="image/*"
								onChange={(e) => handleFileChange(e, "profilePic")}
							/>
						</div>
					</div>

					<div>
						<div>
							<img
								src={previewCoverPic}
								alt="chosen"
								style={{ height: "100px", width: "100px" }}
							/>
						</div>
						<div className="editCA">
							<label htmlFor="avatar_upload">Choose cover picture</label>
							<input
								type="file"
								name="avatar"
								accept="image/*"
								onChange={(e) => handleFileChange(e, "coverPic")}
							/>
						</div>
					</div>

					<div>
						<label htmlFor="username">Username</label>
						<Field
							type="text"
							name="username"
							placeholder="Username"
						/>
						<ErrorMessage
							name="username"
							component="div"
							className="errorMsg"
						/>
					</div>
					<div>
						<label htmlFor="username">Bio</label>
						<Field
							type="text"
							name="Bio"
							placeholder="Bio"
						/>
						<ErrorMessage
							name="Bio"
							component="div"
							className="errorMsg"
						/>
					</div>
					<div>
						<label htmlFor="username">city</label>
						<Field
							type="text"
							name="city"
							placeholder="city"
						/>
						<ErrorMessage
							name="city"
							component="div"
							className="errorMsg"
						/>
					</div>
					<div>
						<label htmlFor="username">website</label>
						<Field
							type="text"
							name="website"
							placeholder="website"
						/>
						<ErrorMessage
							name="website"
							component="div"
							className="errorMsg"
						/>
					</div>
					<div>
						<label htmlFor="username">instagram</label>
						<Field
							type="text"
							name="instagram"
							placeholder="instagram"
						/>
						<ErrorMessage
							name="instagram"
							component="div"
							className="errorMsg"
						/>
					</div>
					<div>
						<label htmlFor="username">x</label>
						<Field
							type="text"
							name="x"
							placeholder="x"
						/>
						<ErrorMessage
							name="x"
							component="div"
							className="errorMsg"
						/>
					</div>
					<div>
						<label htmlFor="username">linkedln</label>
						<Field
							type="text"
							name="linkedln"
							placeholder="linkedln"
						/>
						<ErrorMessage
							name="linkedln"
							component="div"
							className="errorMsg"
						/>
					</div>
					<button disabled={isLoading} type="submit">{isLoading ? 'updating...' : 'Submit'}</button>
				</form>
			</FormikProvider>
		</div>
	);
};

export default Update;
