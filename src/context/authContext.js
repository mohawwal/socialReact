import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(
		JSON.parse(localStorage.getItem("user")) || null,
	);

	const login = async (data) => {
		try {
			const response = await axios.post(
				"http://localhost:8800/api/auth/login",
				data,
			);
			const { user, token } = response.data;
			
			setCurrentUser(user);
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));

			return response.data;
		} catch (error) {
			console.log(
				"Login error:",
				error.response ? error.response.data : error.message,
			);
			throw error;
		}
	};

	const logout = async () => {
		try {
			const response = await axios.post("http://localhost:8800/api/auth/logout");
		
			localStorage.removeItem("user")
			localStorage.removeItem("token")
			setCurrentUser(null);

			return response.data


		}catch(err) {
			console.log("Logout error:", err.response ? err.response.data : err.message);
			throw err;
		}
	} 

	useEffect(() => {
		const authUser = localStorage.getItem("user")
		if(authUser) {
			setCurrentUser(JSON.parse(authUser))
		}
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
