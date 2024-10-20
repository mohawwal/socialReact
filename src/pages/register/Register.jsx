import { Link } from "react-router-dom";
import "./register.scss";
import { useFormik, FormikProvider, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
// import AlertContext from "../../context/alertContext";

const Register = () => {
	const [err, setErr] = useState(null); 

	// Formik initial value
	const initialValue = {
		username: "",
		password: "",
		email: "",
	};

	const [avatar, setAvatar] = useState(null);

	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.min(3, "Username must be at least 3 characters long")
			.max(20, "Username cannot exceed 20 characters")
			.required("Username is required"),
		email: Yup.string()
			.email("Invalid email format")
			.required("Email is required"),
		password: Yup.string()
			.min(8, "Password must be at least 8 characters long")
			.matches(/(?=.*\d)/, "Password must contain at least one digit")
			.matches(
				/(?=.*[a-z])/i,
				"Password must contain at least one lowercase letter",
			)
			.matches(
				/(?=.*[A-Z])/i,
				"Password must contain at least one uppercase letter",
			)
			.matches(
				/(?=.*[@$!%*?&.])/i,
				"Password must contain one special character",
			)
			.required("Password is required"),
	});

	// Formik setup
	const formik = useFormik({
		initialValues: initialValue,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				const formData = new FormData();
				formData.append("username", values.username);
				formData.append("password", values.password);
				formData.append("email", values.email);
				if (avatar) {
					formData.append("avatar", avatar); 
				}
				const response = await axios.post("http://localhost:8800/api/auth/register", formData);

				if (response.status === 200 || response.status === 201) {
					//alert("Registration successful!");
					
					window.location.href = "/login"; 
				}
			} catch (err) {
				setErr(err?.response?.data);
				//alert(err);
			}
		},
	});

	return (
		<div className="register">
			<div className="card">
				<div className="left">
					<h1>Lama Social.</h1>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
						alias totam numquam ipsa exercitationem dignissimos, error nam,
						consequatur.
					</p>
					<span>Do you have an account?</span>
					<Link to="/login">
						<button>Login</button>
					</Link>
				</div>
				<div className="right">
					<h1>Register</h1>
					{err && <div className="error">{err.message}</div>}{" "}
					{/* Display error */}
					<FormikProvider value={formik}>
						<form onSubmit={formik.handleSubmit}>
							<div>
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
								<Field
									type="email"
									name="email"
									placeholder="Email"
								/>
								<ErrorMessage
									name="email"
									component="div"
									className="errorMsg"
								/>
							</div>
							<div>
								<Field
									type="password"
									name="password"
									placeholder="Password"
								/>
								<ErrorMessage
									name="password"
									component="div"
									className="errorMsg"
								/>
							</div>
							<div>
								<input
									type="file"
									name="avatar"
									onChange={(e) => setAvatar(e.target.files[0])}
								/>
							</div>
							<button type="submit">Register</button>
						</form>
					</FormikProvider>
				</div>
			</div>
		</div>
	);
};

export default Register;
