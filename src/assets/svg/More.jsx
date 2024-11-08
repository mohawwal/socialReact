import React from "react";

const More = ({ fill, width }) => {
	return (
		<svg
			viewBox="0 0 24 24"
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
					d="M8 12H8.01"
					stroke={fill}
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>{" "}
				<path
					d="M12 12H12.01"
					stroke={fill}
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>{" "}
				<path
					d="M16 12H16.01"
					stroke={fill}
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>{" "}
				<path
					d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					stroke={fill}
					stroke-width="2"
				></path>{" "}
			</g>
		</svg>
	);
};

export default More;
