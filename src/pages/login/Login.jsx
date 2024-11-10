// Login.js
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import * as Yup from "yup";
import { useFormik, FormikProvider, Field, ErrorMessage } from "formik";
import AlertContext from "../../context/alertContext";

const Login = () => {
	const { login } = useContext(AuthContext);
	const [, setAlert] = useContext(AlertContext);
	const navigate = useNavigate()

	const showAlert = (message, type) => {
		setAlert({
			message,
			type,
		});
	};
	const initialValue = {
		username: "",
		password: "",
	};

	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.min(3, "Username must be at least 3 characters long")
			.max(20, "Username cannot exceed 20 characters")
			.required("Username is required"),

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
				const response = await login(values);
				console.log("Login success:", response);
				showAlert("Login successful", "success");
				navigate('/')
			} catch (err) {
				console.log("Login error:", err?.response?.data?.message);
				showAlert( "Login failed. Please try again.", "error" ); 
			}
		},
	});

	return (
		<div className="login">
			<div className="card">
				<div className="left">
					<h1>BLINK SPACE.</h1>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
						alias totam numquam ipsa exercitationem dignissimos, error nam,
						consequatur.
					</p>
					<div>
						<span>Don't you have an account?</span>
						<Link to="/register">
							<button>Register</button>
						</Link>
					</div>
				</div>
				<div className="right">
					<div className="loginForm">
						<h1>Login</h1>
						<FormikProvider value={formik}>
							<form onSubmit={formik.handleSubmit}>
								<div>
									<label htmlFor="username">Username</label>
									<Field
										type="text"
										name="username"
										className="textBox"
									/>
									<ErrorMessage
										name="username"
										component="div"
										className="errorMsg"
									/>
								</div>
								<div>
									<label htmlFor="password">Password</label>
									<Field
										type="password"
										name="password"
										className="textBox"
									/>
									<ErrorMessage
										name="password"
										component="div"
										className="errorMsg"
									/>
								</div>
								<div className="btn">
									<button type="submit">Login</button>
								</div>

								<div className="donBtn">
									<span>Don't you have an account?</span>
									<Link to="/register">
										<button>Register</button>
									</Link>
								</div>
							</form>
						</FormikProvider>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
