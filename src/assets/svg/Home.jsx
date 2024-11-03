import React from "react";

const Home = ({ fill, width }) => {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			width={width}
		>
			<g
				id="SVGRepo_bgCarrier"
				stroke-width="0"
			></g>
			<g
				id="SVGRepo_tracerCarrier"
				stroke-linecap="round"
				stroke-linejoin="round"
			></g>
			<g id="SVGRepo_iconCarrier">
				{" "}
				<path
					d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z"
					fill={fill}
				></path>{" "}
			</g>
		</svg>
	);
};

export default Home;
