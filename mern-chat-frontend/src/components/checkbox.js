// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const Checkbox = ({ activity }) => {
// 	const user = useSelector((state) => state.user);

// 	const [activitiesChecked, setActivitiesChecked] = useState([
// 		"favoriteSoccer",
// 		"favoriteHiking",
// 		"favoriteBasketball",
// 	]);
// 	const [favorite, setFavorite] = useState({});
// 	const [itemId, setItemId] = useState(user._id);

// 	// useEffect(() => {
// 	// 	if (user) {
// 	// 		activitiesChecked.forEach((activity) => {
// 	// 			axios

// 	// 				.get(`http://localhost:5001/users/${itemId}?activity=${activity}`)
// 	// 				.then((res) => {
// 	// 					console.log(res.data);
// 	// 					setFavorite({
// 	// 						...favorite,
// 	// 						[activity]: favorite[activity],
// 	// 					});
// 	// 				})
// 	// 				// .then(
// 	// 				// 	(res) =>
// 	// 				// 		console.log({ ...favorite, [activity]: favorite[activity] })
// 	// 				// 	// setFavorite({ ...favorite, [activity]: favorite[activity] })
// 	// 				// )
// 	// 				.catch((err) => console.error(err));
// 	// 		});
// 	// 	}
// 	// }, [activitiesChecked, favorite, itemId, user]);
// 	const toggleFavorite = () => {
// 		// Send a PATCH request to the server to toggle the favorite status
// 		axios
// 			.patch(`http://localhost:5001/users/${itemId}`, { activity })
// 			.then((res) =>
// 				setFavorite({ ...favorite, [activity]: !favorite[activity] })
// 			)
// 			.catch((err) => console.error(err));
// 	};

// 	return (
// 		<input
// 			onChange={toggleFavorite}
// 			type="checkbox"
// 			value={favorite[activity]}
// 			checked={favorite[activity]}
// 		/>
// 	);
// };

// export default Checkbox;
