import axios from "axios";
import { useLocation } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import {
	Tooltip,
	Modal,
	Form,
	Button,
	Col,
	ListGroup,
	Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import "./Sidebar.css";

function SidebarCommon(props) {
	const moment = require("moment");

	const location = useLocation();
	const locationText =
		location.pathname.replace("/", "").charAt(0).toUpperCase() +
		location.pathname.slice(2);

	const user = useSelector((state) => state.user);

	const dispatch = useDispatch();
	const {
		socket,
		setMembers,
		setCurrentRoom,
		getAppRooms,
		rooms,
		setPrivateMemberMsg,
		currentRoom,
	} = useContext(AppContext);

	const [newRoomName, setNewRoomName] = useState("");
	const [newRoomDescription, setNewRoomDescription] = useState("");
	const [newRoomDate, setNewRoomDate] = useState(new Date());
	const [show, setShow] = useState(false);

	const onUpdateField = (e) => {
		const nextFormState = {
			...newRoomName,
			[e.target.name]: e.target.value,
		};
		setNewRoomName(nextFormState);
	};

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	function joinRoom(room, isPublic = true) {
		if (!user) {
			return alert("Please login");
		}
		socket.emit("join-room", room, currentRoom);
		setCurrentRoom(room);
		console.log("join room");

		if (isPublic) {
			setPrivateMemberMsg(null);
		}
		// dispatch for notifications
		dispatch(resetNotifications(room));
	}

	socket.off("notifications").on("notifications", (room) => {
		if (currentRoom !== room) dispatch(addNotifications(room));
	});

	useEffect(() => {
		if (user) {
			getRooms();
			socket.emit("new-user");
			Array.from(
				document.querySelectorAll('button[data-bs-toggle="tooltip"]')
			).forEach((tooltipNode) => new Tooltip(tooltipNode));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	socket.off("new-user").on("new-user", (payload) => {
		setMembers(payload);
	});

	function getRooms() {
		fetch("http://localhost:5001/rooms")
			.then((res) => res.json())
			.then((data) => getAppRooms(data));
	}

	if (!user) {
		return <></>;
	}

	function addRoom(e) {
		e.preventDefault();
		axios
			.post("http://localhost:5001/rooms/", {
				room: newRoomName,
				roomType: locationText,
				roomDate: newRoomDate,
				roomUser: user._id,
				roomDescription: newRoomDescription,
			})
			.then((res) => {
				getRooms();
				setCurrentRoom(currentRoom);
				setShow(false);
			});
	}

	return (
		<>
			<Row>
				<Col md={12}>
					<div className="main-topbar__welcome message-alert alert alert-light mb-3 d-flex align-items-center justify-content-between">
						<h5>{locationText} Chat</h5>
						<i
							title="Add a New Room"
							onClick={handleShow}
							className="fa-sharp fa-solid fa-circle-plus text-success"
						></i>
					</div>
				</Col>
			</Row>
			<Row>
				<Col md={12} className="gx-md-5">
					<ListGroup className="mb-5 me-lg-3">
						{rooms
							.filter(
								(room) =>
									room.room === "Lobby" && room.roomType === locationText
							)
							.map((room, listIdx) => (
								<div key={listIdx}>
									<ListGroup.Item
										id={"listIdxRoom" + listIdx}
										className="listItem mb-2"
										onClick={() => joinRoom(room._id)}
										active={room._id === currentRoom}
										style={{
											cursor: "pointer",
											display: "flex",
											justifyContent: "space-between",
										}}
									>
										<div className="list-info pe-3">
											<h5 className="list-info__header mb-0">{room.room}</h5>
										</div>
										{currentRoom !== room._id && (
											<span className="badge__custom badge rounded-pill bg-dark">
												{user.newMessages[room._id]}
											</span>
										)}{" "}
									</ListGroup.Item>
								</div>
							))}
						<div>
							<Tabs className="navtabs__filter mb-2" defaultActiveKey="all">
								<Tab eventKey="all" title="All">
									<div className="list-wrapper pt-2">
										{rooms
											.filter(
												(room) =>
													room.room !== "Lobby" &&
													room.roomType === locationText
											)
											.map((room, listIdx) => (
												<div key={listIdx}>
													<ListGroup.Item
														id={"listIdxRoom" + listIdx}
														className="listItem mb-2"
														onClick={() => joinRoom(room._id)}
														active={room._id === currentRoom}
														style={{
															cursor: "pointer",
															display: "flex",
															justifyContent: "space-between",
														}}
													>
														<div className="list-info pe-3">
															<h5 className="list-info__header">{room.room}</h5>
															<div>
																<span className="me-3">
																	{room.room !== "Lobby" &&
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
														{currentRoom !== room._id && (
															<span className="badge__custom badge rounded-pill bg-dark">
																{user.newMessages[room._id]}
															</span>
														)}
														{user._id === room.roomUser && (
															<a href="/rooms/myrooms">
																<i
																	className="fa-solid fa-signature"
																	title="Edit my Rooms"
																></i>
															</a>
														)}{" "}
													</ListGroup.Item>
												</div>
											))}{" "}
									</div>
								</Tab>
								<Tab eventKey="upcoming" title="Upcoming">
									<div className="list-wrapper pt-2">
										{rooms
											.filter(
												(room) =>
													room.room !== "Lobby" &&
													room.roomType === locationText &&
													moment(room.roomDate).unix() > moment().format("X")
											)
											.sort(
												(a, b) =>
													moment(a.roomDate).format("X") -
													moment(b.roomDate).format("X")
											)
											.map((room, listIdx) => (
												<div key={listIdx}>
													<ListGroup.Item
														id={"listIdxRoom" + listIdx}
														className="listItem mb-2"
														onClick={() => joinRoom(room._id)}
														active={room._id === currentRoom}
														style={{
															cursor: "pointer",
															display: "flex",
															justifyContent: "space-between",
														}}
													>
														<div className="list-info pe-3">
															<h5 className="list-info__header">{room.room}</h5>
															<div>
																<span className="me-3">
																	{room.room !== "Lobby" &&
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
														{currentRoom !== room._id && (
															<span className="badge__custom badge rounded-pill bg-dark">
																{user.newMessages[room._id]}
															</span>
														)}
														{user._id === room.roomUser && (
															<a href="/rooms/myrooms">
																<i
																	className="fa-solid fa-signature"
																	title="Edit my Rooms"
																></i>
															</a>
														)}{" "}
													</ListGroup.Item>
												</div>
											))}{" "}
									</div>
								</Tab>
								<Tab eventKey="owner" title="My Rooms">
									<div className="list-wrapper pt-2">
										{rooms
											.filter(
												(room) =>
													room.room !== "Lobby" &&
													room.roomType === locationText &&
													user._id === room.roomUser
											)
											.map((room, listIdx) => (
												<div key={listIdx}>
													<ListGroup.Item
														id={"listIdxRoom" + listIdx}
														className="listItem mb-2"
														onClick={() => joinRoom(room._id)}
														active={room._id === currentRoom}
														style={{
															cursor: "pointer",
															display: "flex",
															justifyContent: "space-between",
														}}
													>
														<div className="list-info pe-3">
															<h5 className="list-info__header">{room.room}</h5>
															<div>
																<span className="me-3">
																	{room.room !== "Lobby" &&
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
														{currentRoom !== room._id && (
															<span className="badge__custom badge rounded-pill bg-dark">
																{user.newMessages[room._id]}
															</span>
														)}
														{user._id === room.roomUser && (
															<a href="/rooms/myrooms">
																<i
																	className="fa-solid fa-signature"
																	title="Edit my Rooms"
																></i>
															</a>
														)}{" "}
													</ListGroup.Item>
												</div>
											))}{" "}
									</div>
								</Tab>
							</Tabs>
						</div>

						<Modal show={show} onHide={handleClose}>
							<Modal.Header closeButton>
								<Modal.Title>Add a New Room</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form id="roomForm" onSubmit={addRoom}>
									<Row>
										<Col md={12} className="mb-3">
											<Form.Group className="d-flex flex-column">
												<Form.Control
													required
													className="mb-3"
													type="text"
													placeholder="Room Name"
													value={newRoomName}
													name="roomName"
													aria-label="Room Name Field"
													onChange={(event) =>
														setNewRoomName(event.target.value)
													}
												></Form.Control>
												<MuiPickersUtilsProvider utils={DateFnsUtils}>
													<DateTimePicker
														className="mb-3"
														label="Time of Event"
														inputVariant="outlined"
														ampm={false}
														value={newRoomDate}
														format="dd-MM-yyyy HH:MM"
														disablePast
														onChange={(newDate) => {
															setNewRoomDate(newDate);
														}}
														showTodayButton
													/>
												</MuiPickersUtilsProvider>
												<Form.Control
													className="mb-3"
													type="text"
													placeholder="Description"
													value={newRoomDescription}
													onChange={(event) =>
														setNewRoomDescription(event.target.value)
													}
												></Form.Control>
											</Form.Group>
										</Col>
										<Col md={3}>
											<Button
												id="form-btn"
												type="submit"
												variant="primary"
												onChange={onUpdateField}
											>
												Save
												<i className="fas fa-paper-plane"></i>
											</Button>
										</Col>
									</Row>
								</Form>
							</Modal.Body>
							<Modal.Footer></Modal.Footer>
						</Modal>
					</ListGroup>
				</Col>
			</Row>
		</>
	);
}

export default SidebarCommon;
