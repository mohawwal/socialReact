import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { SearchContextProvider } from "./context/searchContext";
import { BookmarkContextProvider } from "./context/bookmarkContext";
import { AlertContextProvider } from "./context/alertContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<AlertContextProvider>
			<BookmarkContextProvider>
				<SearchContextProvider>
					<DarkModeContextProvider>
						<AuthContextProvider>
							<App />
						</AuthContextProvider>
					</DarkModeContextProvider>
				</SearchContextProvider>
			</BookmarkContextProvider>
		</AlertContextProvider>
	</React.StrictMode>,
);
