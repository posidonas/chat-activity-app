import React, { useContext, useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "../context/appContext";
import "./Home.css";

function Home() {
	const { activities, getActivities } = useContext(AppContext);

	useEffect(() => {
		getAllActivities();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	function getAllActivities() {
		fetch("http://localhost:5001/activities")
			.then((res) => res.json())
			.then((data) => getActivities(data));
	}
	return (
		<Container fluid>
			<Row>
				<Col
					md={6}
					className="d-flex flex-direction-column align-items-center justify-content-center"
				>
					<div>
						<h1>Time to get Active!</h1>
						<p>Connect with the world</p>
						<div className="d-flex me-3">
							{activities.map((activity) => (
								<LinkContainer key={activity._id} to={activity.activityName}>
									<Button
										key={activity._id}
										to={activity.activityName}
										className="me-3"
										variant="success"
									>
										{activity.activityName}{" "}
										<i className="fas fa-comments home-message-icon"></i>
									</Button>
								</LinkContainer>
							))}
						</div>
					</div>
				</Col>
				<Col md={6} className="home__bg"></Col>
			</Row>
		</Container>
	);
}

export default Home;
