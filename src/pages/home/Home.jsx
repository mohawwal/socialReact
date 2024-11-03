import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import SearchSection from "../../components/searchSection/SearchSection";
import "./home.scss";
import { useRef } from "react";

const Home = () => {
	const shareRef = useRef();
	
	return (
		<div className="home">
			<div className="homePage">
				<div className="searchToggle">
					<SearchSection/>
				</div>
				<Share ref={shareRef}/>
				<Posts />
			</div>
		</div>
	);
};

export default Home;
