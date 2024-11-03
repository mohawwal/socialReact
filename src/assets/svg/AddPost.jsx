import React from "react";

const AddPost = ({ fill, width }) => {
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
				<g opacity="0.4">
					{" "}
					<path
						d="M8 12H16"
						stroke={fill}
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path>{" "}
					<path
						d="M12 16V8"
						stroke={fill}
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path>{" "}
				</g>{" "}
				<path
					d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
					stroke={fill}
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>{" "}
			</g>
		</svg>
	);
};

export default AddPost;
