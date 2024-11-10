import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import SearchSection from "../../components/searchSection/SearchSection";
import "./home.scss";
import { useRef } from "react";
import DarkMode from "../../assets/svg/DarkMode";
import LightMode from "../../assets/svg/LightMode";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";

const Home = () => {
	const shareRef = useRef();
	const { darkMode, toggle } = useContext(DarkModeContext);

	const fillMode = darkMode ? "white" : "#222222da";

	return (
		<div className="home">
			<div className="homePage">
				<Share ref={shareRef} />
				<Posts />
				<div className="mode">
					{darkMode ? (
						<div
							className="item"
							onClick={toggle}
						>
							<LightMode width={"20px"} />
						</div>
					) : (
						<div
							className="item"
							onClick={toggle}
						>
							<DarkMode
								width={"20px"}
								fill={fillMode}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
