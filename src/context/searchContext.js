import { createContext, useState } from "react";
import axiosInstance from "../axios";
//import { useNavigate } from "react-router-dom";

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
	const [keyword, setKeyword] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	//const navigate = useNavigate()

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

	const [toggleSearch, setToggleSearch] = useState(false);
	console.log('toggleSearch', toggleSearch)

	const handleSearchToggleFunc = () => {
		setToggleSearch(!toggleSearch);
		//navigate('/')
	};

	return (
		<SearchContext.Provider
			value={{ setKeyword, keyword, searchResults, handleSearchToggleFunc, toggleSearch, searchFunc }}
		>
			{children}
		</SearchContext.Provider>
	);
};
