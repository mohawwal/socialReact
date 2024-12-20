import React from "react";

const LightMode = ({width}) => {
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
				<g
					clip-path="url(#a)"
					stroke="#ffffff"
					stroke-width="1.5"
					stroke-miterlimit="10"
				>
					{" "}
					<path
						d="M5 12H1M23 12h-4M7.05 7.05 4.222 4.222M19.778 19.778 16.95 16.95M7.05 16.95l-2.828 2.828M19.778 4.222 16.95 7.05"
						stroke-linecap="round"
					></path>{" "}
					<path
						d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
						fill="#ffffff"
						fill-opacity=".16"
					></path>{" "}
					<path
						d="M12 19v4M12 1v4"
						stroke-linecap="round"
					></path>{" "}
				</g>{" "}
				<defs>
					{" "}
					<clipPath id="a">
						{" "}
						<path
							fill="#ffffff"
							d="M0 0h24v24H0z"
						></path>{" "}
					</clipPath>{" "}
				</defs>{" "}
			</g>
		</svg>
	);
};

export default LightMode;
