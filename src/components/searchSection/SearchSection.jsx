import React, { useContext } from "react";
import { SearchContext } from "../../context/searchContext";
import "./searchSection.scss";
import { Link } from "react-router-dom";

const SearchSection = () => {
	const { setKeyword, keyword, searchResults, searchFunc } =
		useContext(SearchContext);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setKeyword(value);
		searchFunc();
	};

	return (
		<div className="searchSection">
			<div className="searchSectionInput">
				<input
					type="text"
					value={keyword}
					onChange={handleInputChange}
					placeholder="Search users..."
				/>
			</div>
			<div className="searchSectionList">
				{searchResults.length > 0 ? (
					searchResults.map((result) => (
						<div
							className="userInfo"
							key={result.id}
						>
							<img
								src={result.profilePic}
								alt=""
							/>
							<div className="details">
								<Link
									to={`/profile/${result.id}`}
									style={{ textDecoration: "none", color: "inherit" }}
								>
									<span className="name">{result.Username}</span>
								</Link>
								<span className="date">{result.name}</span>
							</div>
						</div>
					))
				) : (
					<div
						style={{
							fontSize: "0.8rem",
							fontWeight: "500",
							textAlign: "center",
						}}
						className="notF"
					>
						No results found
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchSection;
