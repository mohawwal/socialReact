import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { SearchContextProvider } from "./context/searchContext";
//import { AlertProvider } from "./context/alertContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<SearchContextProvider>
			<DarkModeContextProvider>
				<AuthContextProvider>
					<App />
				</AuthContextProvider>
			</DarkModeContextProvider>
		</SearchContextProvider>
	</React.StrictMode>,
);
