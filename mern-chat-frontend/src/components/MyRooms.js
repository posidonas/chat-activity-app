import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Modal, Form, Button, Col, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";

import * as dayjs from "dayjs";
import MomentUtils from "@date-io/date-fns"; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import "./myRooms.css";

function MyRoomList(room, roomName) {
	const user = useSelector((state) => state.user);
	const moment = require("moment");

	const { socket, setCurrentRoom, getAppRooms, rooms, currentRoom } =
		useContext(AppContext);
	const [newRoomName, setNewRoomName] = useState("");
	const [newRoomDate, setNewRoomDate] = useState(null);
	const [newRoomDescription, setNewRoomDescription] = useState("");

	const [showEdit, setShowEdit] = useState(false);
	const handleCloseEdit = () => {
		setShowEdit(false);
	};

	function joinRoom(room) {
		if (!user) {
			return alert("Please login");
		}
		setCurrentRoom(room);

		console.log(room);
	}

	function handleShowEdit(room) {
		setNewRoomName(room.roomName);
		setNewRoomDate(null);
		setNewRoomDescription(room.roomDescription);
		setShowEdit(true);
		console.log(moment(room.roomDate).format("dddd: DD-MM-YYYY HH:mm"));
	}

	useEffect(() => {
		if (user) {
			getRooms();
			setNewRoomName(room.roomName);
			setNewRoomDate(null);
			setNewRoomDescription(room.roomDescription);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function getRooms() {
		fetch("http://localhost:5001/rooms")
			.then((res) => res.json())
			.then((data) => getAppRooms(data));
	}

	if (!user) {
		return <></>;
	}
	const deleteAppRoom = (id) => {
		socket.emit(
			"delete-room",
			axios.delete(`http://localhost:5001/rooms/${id}`)
		);
		getRooms();
	};

	const updateAppRoom = (e, id) => {
		socket.emit(
			"update-room",
			e.preventDefault(),
			axios
				.put(`http://localhost:5001/rooms/${id}`, {
					roomName: newRoomName,
					roomDate: newRoomDate,
					roomDescription: newRoomDescription,
				})
				.then((res) => {
					getRooms();
					setNewRoomName("");
					setNewRoomDate("");
					setNewRoomDescription("");
				})
		);
	};

	return (
		<div>
			<h1 className="my-5">My Rooms:</h1>
			<ListGroup className="roomsListGroup mb-5">
				{/* Hiking */}
				<div className="listItemWrapper mb-5">
					{rooms
						.filter(
							(room) =>
								user._id === room.roomUser &&
								room.roomName !== "Lobby" &&
								room.roomType === "Hiking"
						)
						.map((room, listIdxHiking) => (
							<div
								key={listIdxHiking}
								id="hikingRoom"
								className="roomsListItem"
							>
								{listIdxHiking === 0 && (
									<h2 className="mb-3">
										<a href="/Hiking">Hiking</a>
									</h2>
								)}
								<ListGroup.Item
									className="listItem mb-3"
									onClick={() => joinRoom(room._id)}
									active={room._id === currentRoom}
									style={{
										cursor: "pointer",
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<div className="list-info pe-3">
										<h5>{room.roomName}</h5>
										<div>
											<span className="me-3">
												{room.roomName !== "Lobby" &&
													`${moment(room.roomDate).format(
														"dddd: DD-MM-YYYY HH:mm"
													)}`}
											</span>
											{room.roomDescription ? (
												<i
													data-bs-toggle="tooltip"
													effect="solid"
													data-bs-placement="bottom"
													title={room.roomDescription}
													className="fas fa-info-circle"
												></i>
											) : (
												""
											)}{" "}
										</div>
									</div>
									<div>
										<span
											className="me-3"
											onClick={() => handleShowEdit(room._id)}
										>
											<i className="fas fa-pen-to-square"></i>
										</span>
										<span onClick={() => deleteAppRoom(room._id)}>
											<i className="fas fa-times"></i>
										</span>
									</div>
								</ListGroup.Item>
							</div>
						))}{" "}
				</div>
				{/* Soccer */}
				<div className="listItemWrapper mb-5">
					{rooms
						.filter(
							(room) =>
								user._id === room.roomUser &&
								room.roomName !== "Lobby" &&
								room.roomType === "Soccer"
						)
						.map((room, listIdxSoccer) => (
							<div
								key={listIdxSoccer}
								id="soccerRoom"
								className="roomsListItem"
							>
								{listIdxSoccer === 0 && (
									<h2 className="mb-3">
										<a href="/Soccer">Soccer</a>
									</h2>
								)}
								<ListGroup.Item
									className="listItem mb-3"
									onClick={() => joinRoom(room._id)}
									active={room._id === currentRoom}
									style={{
										cursor: "pointer",
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<div className="list-info pe-3">
										<h5>{room.roomName}</h5>
										<div>
											<span className="me-3">
												{room.roomName !== "Lobby" &&
													`${moment(room.roomDate).format(
														"dddd: DD-MM-YYYY HH:mm"
													)}`}
											</span>
											{room.roomDescription ? (
												<i
													data-bs-toggle="tooltip"
													effect="solid"
													data-bs-placement="bottom"
													title={room.roomDescription}
													className="fas fa-info-circle"
												></i>
											) : (
												""
											)}{" "}
										</div>
									</div>
									<div>
										<span
											className="me-3"
											onClick={() => handleShowEdit(room._id)}
										>
											<i title="Edit" className="fas fa-pen-to-square"></i>
										</span>
										<span onClick={() => deleteAppRoom(room._id)}>
											<i title="Delete" className="fas fa-times"></i>
										</span>
									</div>
								</ListGroup.Item>
							</div>
						))}{" "}
				</div>
			</ListGroup>
			{rooms
				.filter((room) => room._id === currentRoom)
				.map((room, editIdx) => (
					<Modal key={editIdx} show={showEdit} onHide={() => handleCloseEdit()}>
						<Modal.Header closeButton>
							<Modal.Title>Edit Room</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form
								id="roomFormEdit"
								onSubmit={(e) => updateAppRoom(e, room._id)}
							>
								<Row>
									<Col md={12} className="mb-3">
										<Form.Group className="d-flex flex-column">
											<Form.Control
												className="mb-3"
												type="text"
												placeholder={room.roomName}
												defaultValue={room?.roomName}
												value={newRoomName}
												onChange={(e) => setNewRoomName(e.target.value)}
											></Form.Control>
											<MuiPickersUtilsProvider utils={MomentUtils}>
												<DateTimePicker
													className="mb-3"
													label="Time of Event"
													inputVariant="outlined"
													ampm={false}
													initialFocusedDate={room.roomDate}
													emptyLabel={moment(room.roomDate).format(
														"dddd: DD-MM-YYYY HH:mm"
													)}
													// valueDefault={new Date("2024/09/28")}
													// selected={new Date("2024/09/28")}
													// defaultValue={new Date("2024/09/28")}
													// emptyLabel={moment(room.roomDate).format(
													// 	"dddd: DD-MM-YYYY HH:mm"
													// )}
													value={newRoomDate}
													format={"eeee:  dd-MM-yyyy HH:mm"}
													disablePast
													onChange={(newRoomDate) => {
														setNewRoomDate(newRoomDate);
													}}
													showTodayButton
												/>
											</MuiPickersUtilsProvider>
											<Form.Control
												className="mb-3"
												type="text"
												placeholder="Description"
												defaultValue={room?.roomDescription}
												value={newRoomDescription}
												onChange={(event) =>
													setNewRoomDescription(event.target.value)
												}
											></Form.Control>
										</Form.Group>
									</Col>
									<Col md={3}>
										<Button
											id="form-btn-edit"
											type="submit"
											variant="primary"
											onClick={() => handleCloseEdit()}
										>
											Save
											<i className="fas fa-paper-plane"></i>
										</Button>
									</Col>
								</Row>
							</Form>
						</Modal.Body>
					</Modal>
				))}{" "}
		</div>
	);
}

export default MyRoomList;
