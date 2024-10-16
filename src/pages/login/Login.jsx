import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import * as Yup from "yup";
import { useFormik, FormikProvider, Field, ErrorMessage } from "formik";
//import AlertContext from "../../context/alertContext";

const Login = () => {
	const { login } = useContext(AuthContext);
	//const [, setAlert] = useContext(AlertContext);

	// const showAlert = (message, type) => {
	// 	setAlert({
	// 		message,
	// 		type,
	// 	});
	// };

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

	//formik setup
	const formik = useFormik({
		initialValues: initialValue,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				await login(values);
				console.log('success')
			} catch (err) {
				console.log(err?.response?.data?.message)
				//showAlert(err?.response?.data?.message, "error");
			}
		},
	});

	return (
		<div className="login">
			<div className="card">
				<div className="left">
					<h1>Hello World.</h1>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
						alias totam numquam ipsa exercitationem dignissimos, error nam,
						consequatur.
					</p>
					<span>Don't you have an account?</span>
					<Link to="/register">
						<button>Register</button>
					</Link>
				</div>
				<div className="right">
					<h1>Login</h1>
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
							<button type="submit">Login</button>
						</form>
					</FormikProvider>
				</div>
			</div>
		</div>
	);
};

export default Login;
