import React, { useContext } from "react";
import { SearchContext } from "../../context/searchContext";
import "./searchSection.scss";
import { useNavigate } from "react-router-dom";
import Press from "../../assets/svg/Press";

const SearchSection = () => {
	const navigate = useNavigate();
	const { searchResults, setSearchResults, setToggleSearch, toggleSearch, setKeyword, searchFunc } = useContext(SearchContext);

	const handleKeywords = (e) => {
		setKeyword(e.target.value);
	};

	const handleProfile = (userId) => {
		navigate(`/profile/${userId}`);
    setSearchResults([])
    setToggleSearch(false)
	};


	return (
		<div className="searchSection" style={toggleSearch ? {display: 'block'} : {display: 'none'}}>
			<div className="searchText">
				<input
					type="text"
					placeholder="🔍 search username..."
					onChange={handleKeywords}
				/>
				<span onClick={searchFunc}>
					<Press
						width={"23px"}
						fill={"grey"}
					/>
				</span>
			</div>

			<div className="searchSectionList">
				<div>
					{Array.isArray(searchResults) &&
						searchResults.map((result) => (
							<span
								onClick={() => handleProfile(result.id)}
								style={{ textDecoration: "none", color: "inherit" }}
								className="listNames"
							>
								@ {result.Username}
							</span>
						))}
				</div>
			</div>
		</div>
	);
};

export default SearchSection;
