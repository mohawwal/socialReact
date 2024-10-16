import { createContext, useState, useRef, useEffect } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
	const [alert, setAlert] = useState(null);
	const timeRef = useRef(null);

	const alertStyles = {
		position: "fixed",
		top: 0,
		zIndex: "999",
		padding: "16px",
		borderRadius: "6px",
		fontSize: "0.9rem",
		fontWeight: 400,
		width: "100%",
		maxWidth: "300px",
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
							marginLeft: "10px",
						}}
					>
						x
					</button>
				</div>
			)}
			{children}
		</AlertContext.Provider>
	);
};

export default AlertContext;
