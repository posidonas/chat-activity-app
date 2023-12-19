import axios from "axios";

import React, { useRef, useState, useContext, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "../context/appContext";
import { useSelector } from "react-redux";
import Checkbox from "../components/checkbox";
import "./Home.css";

function Home() {
	// const [newActivityName, setActivityName] = useState("");

	const { activities, getActivities } = useContext(AppContext);
	const { subscribedActivities, getSubscribedActivities } =
		useContext(AppContext);

	const user = useSelector((state) => state.user);
	// const [activitySubscribed, setChecked] = useState({
	// 	activities: [],
	// });

	const [favorite, setFavorite] = useState({});
	// const [itemId, setItemId] = useState(user._id);

	const [favorite1, setFavorite1] = useState({});
	const [itemId1, setItemId1] = useState({});
	const [activity1, setActivity1] = useState({});
	const [activity, setActivity] = useState({});

	const [activitiesChecked, setActivitiesChecked] = useState([
		"Soccer",
		"Hiking",
		"Basketball",
	]);

	// const activitySubscribedUser = user._id;
	// if (!activitySubscribedUser) {
	// 	activitiesChecked.forEach((activitiesChecked) => {
	// 		const newActivitySubscribedUser = user._id;
	// 		const newActivitySubscribedName = activitiesChecked;
	// 		const newActivitySubscribed = false;
	// 		axios
	// 			.post(`http://localhost:5001/favorites/`, {
	// 				activitySubscribedName: newActivitySubscribedName,
	// 				activitySubscribed: newActivitySubscribed,
	// 				activitySubscribedUser: newActivitySubscribedUser,
	// 			})
	// 			.then((res) => console.log("created"))
	// 			.catch((err) => console.error(err));
	// 	});
	// }
	const collection = [
		{
			activitySubscribedName: "Soccer",
			activitySubscribedUser: user ? user._id : null,
			activitySubscribed: false,
		},
		{
			activitySubscribedName: "Hiking",
			activitySubscribedUser: user ? user._id : null,
			activitySubscribed: false,
		},
		{
			activitySubscribedName: "Baseball",
			activitySubscribedUser: user ? user._id : null,
			activitySubscribed: false,
		},
	];

	useEffect(() => {
		// Side Effect
		if (user && collection[0].activitySubscribedUser === user._id) {
			axios
				.post("http://localhost:5001/favorites/", collection)
				.then((res) => {
					console.log("Collection created successfully");
					getAllSubscribedActivities();
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, []);

	useEffect(() => {
		getAllActivities();
		getAllSubscribedActivities();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleFavorite1 = (itemId1) => {
		// Send a PATCH request to the server to toggle the favorite status
		axios
			.patch(`http://localhost:5001/favorites/${itemId1}`, {
				activitySubscribed: !favorite1, // Update request body to use the opposite of the current favorite1 state
			})
			.then((res) => {
				setFavorite1((prevFavorite1) => !prevFavorite1);
				getAllSubscribedActivities();
			})
			.catch((err) => console.error(err));
	};
	// const newActivitySubscribedUser = user._id;
	// console.log(inputEl.current.innerText);
	// console.log(newActivitySubscribedUser);
	// function checkRef() {
	// 	return inputEl.current.getAttribute("to");
	// }

	// const onChangeCheckbox = (e, id, req) => {
	// 	// const { value, checked } = e.target;

	// 	// const { activities } = activitySubscribed;

	// 	// console.log(`${value} is ${checked}`);

	// 	// Case 1 : The user checks the box
	// 	if (checked) {
	// 		setChecked({
	// 			activities: [...activities, value],
	// 		});
	// 		// axios
	// 		// 	.put(`http://localhost:5001/activities/${id}`, {
	// 		// 		activitySubscribed: true,
	// 		// 	})
	// 		// 	.then((res) => {
	// 		// 		getAllActivities();
	// 		// 	});

	// 		const newActivitySubscribedUser = user._id;
	// 		const newActivitySubscribedName = e.target.dataset.activity;
	// 		const newActivitySubscribed = true;
	// 		console.log(newActivitySubscribedName);
	// 		console.log(newActivitySubscribedUser);
	// 		axios
	// 			.post(`http://localhost:5001/favorites/`, {
	// 				activitySubscribedName: newActivitySubscribedName,
	// 				activitySubscribed: newActivitySubscribed,
	// 				activitySubscribedUser: newActivitySubscribedUser,
	// 			})
	// 			.then((response) => {
	// 				console.log(response);
	// 			});

	// 		// axios
	// 		// 	.get(`http://localhost:5001/favorites/`, {
	// 		// 		activitySubscribed: newActivitySubscribed,
	// 		// 	})
	// 		// 	.then((activity) => {
	// 		// 		if (activitySubscribed === true) {
	// 		// 			console.log(`Collection exists.`);
	// 		// 		} else {
	// 		// 			console.log(`Collection does not exist.`);
	// 		// 		}
	// 		// 	})
	// 		// 	.catch((error) => {
	// 		// 		console.log(`Error checking if collection  exists:`, error);
	// 		// 	});
	// 	}

	// 	// Case 2  : The user unchecks the box
	// 	else {
	// 		setChecked({
	// 			activities: activities.filter((e) => e !== value),
	// 		});
	// 		const newActivitySubscribedUser = user._id;
	// 		const newActivitySubscribedName = e.target.dataset.activity;
	// 		const newActivitySubscribed = false;
	// 		console.log(newActivitySubscribedName);
	// 		console.log(newActivitySubscribedUser);
	// 		axios
	// 			.delete("http://localhost:5001/favorites", {
	// 				params: {
	// 					activitySubscribedName: newActivitySubscribedName,
	// 					activitySubscribedUser: newActivitySubscribedUser,
	// 				},
	// 			})
	// 			.then((response) => {
	// 				if (response.status === 200) {
	// 					console.log("was deleted");
	// 				} else {
	// 					console.log("NOT deleted");
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				console.log(error);
	// 			});

	// 		axios
	// 			.get(`http://localhost:5001/favorites/`, {
	// 				activitySubscribedName: newActivitySubscribedName,
	// 				activitySubscribed: newActivitySubscribed,
	// 				activitySubscribedUser: newActivitySubscribedUser,
	// 			})
	// 			.then((activity) => {
	// 				if (activity.activitySubscribed === true) {
	// 					console.log(`Collection exists.`);
	// 				} else {
	// 					console.log(`Collection does not exist.`);
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				console.log(`Error checking if collection  exists:`, error);
	// 			});
	// 	}
	// };
	// const userData = subscribedActivities.map(
	// 	(subscribedActivities, listIdxsubscribedActivities) => ({
	// 		activitySubscribed: subscribedActivities.activitySubscribed,
	// 	})
	// );
	// console.log(userData); // Output: [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 35 }, { name: 'Charlie', age: 40 }]
	function getAllActivities() {
		fetch("http://localhost:5001/activities")
			.then((res) => res.json())
			.then((data) => getActivities(data));
	}
	function getAllSubscribedActivities() {
		fetch("http://localhost:5001/favorites")
			.then((res) => res.json())
			.then((data) => getSubscribedActivities(data));
	}

	if (!user) {
		return <></>;
	}

	// const toggleFavorite1 = (itemId1) => {
	// 	// Send a PATCH request to the server to toggle the favorite status
	// 	axios
	// 		.patch(`http://localhost:5001/favorites/${itemId1}`, {
	// 			subscribedActivities,
	// 		}) // Update request body to use activity1 state variable
	// 		.then((res) =>
	// 			setFavorite1({
	// 				...subscribedActivities,
	// 				[subscribedActivities]: !favorite1[subscribedActivities],
	// 			})
	// 		)
	// 		.catch((err) => console.error(err));
	// };

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
							{subscribedActivities
								.filter((room) => room.activitySubscribedUser === user._id)
								.map((subscribedActivities, subscribedIndex) => (
									<div
										key={subscribedIndex}
										className="activity-wrapper btn btn-success me-3"
									>
										<span className="button-ele pe-3">
											<input
												onChange={toggleFavorite1.bind(
													this,
													subscribedActivities._id
												)}
												type="checkbox"
												checked={subscribedActivities.activitySubscribed}
											/>
											<span className="ps-2">
												<a
													className="color-white"
													href={subscribedActivities.activitySubscribedName}
												>
													{subscribedActivities.activitySubscribedName}
												</a>
											</span>

											<i className="fas fa-comments home-message-icon"></i>
										</span>
									</div>
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
