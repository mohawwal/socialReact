import React from "react";
import Conversations from "../conversations/Conversations";
import ChartText from "../chartText/ChartText";
import ChartHead from "../chartHead/ChartHead";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import "./chart.scss";

const Chart = () => {
	const { currentUser } = useContext(AuthContext);

	return (
		<div className="chart">
			<div className="ChartHead">
				<ChartHead />
			</div>
			<div className="Conversations">
				<Conversations currentUser={currentUser} />
			</div>
			<div className="ChartText">
				<ChartText currentUser={currentUser} />
			</div>
		</div>
	);
};

export default Chart;
