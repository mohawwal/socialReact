import { createContext, useState, useRef, useEffect } from "react";
import Cancel from "../assets/svg/Cancel"

export const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
	const [alert, setAlert] = useState(null);
	const timeRef = useRef(null);

	const alertStyles = {
		position: "fixed",
		top: 0,
		right: 0,
		margin: "8px",
		zIndex: "999",
		padding: "7px",
		borderRadius: "8px",
		fontSize: "0.75rem",
		fontWeight: "400",
		maxWidth: "250px",
		width: "50%",
		display: "flex",
		alignItems: "center", 
		flexDirection: "row",
		justifyContent: "space-between",
		overflow: "hidden",
		border: "1px solid black"
	};
	

	const severityStyles = {
		success: {
			color: "#0f5132",
			background: "#d1e7dd",
		},
		info: {
			color: "#055160",
			background: "#90ddee",
		},
		warning: {
			color: "#664d03",
			background: "#fff3cd",
		},
		error: {
			color: "#842029",
			background: "#f8d7da",
		},
	};
	

	useEffect(() => {
		if (timeRef.current) {
			clearTimeout(timeRef.current);
		}
		timeRef.current = setTimeout(() => {
			setAlert(null);
		}, 4000);
	}, [alert]);

	const cancelAlert = () => {
		setAlert(null);
	};

	return (
		<AlertContext.Provider value={[alert, setAlert]}>
			{alert && (
				<div
					style={{
						...alertStyles,
						...severityStyles[alert.type || "info"],
					}}
				>
					<span>{alert.message}</span>
					<button
						onClick={cancelAlert}
						style={{
							background: "none",
							border: "none",
							color: "#000",
							fontWeight: "bold",
							cursor: "pointer",
							margin: "0"
						}}
					>
						<Cancel width={'17px'} fill={'red'}/>
					</button>
				</div>
			)}
			{children}
		</AlertContext.Provider>
	);
};

export default AlertContext;
