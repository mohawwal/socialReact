import { createContext, useState } from "react";
import axiosInstance from "../axios";

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
	const [keyword, setKeyword] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const searchFunc = async () => {
		
		if (keyword.trim() === "") {
			setSearchResults([]);
			return;
		}

		try {
			const response = await axiosInstance.get(`/api/users?keyword=${keyword}`);
			setSearchResults(response.data.data);
		} catch (err) {
			console.error("Search error:", err);
		}
	};


	return (
		<SearchContext.Provider
			value={{ setKeyword, keyword, searchResults, searchFunc }}
		>
			{children}
		</SearchContext.Provider>
	);
};
