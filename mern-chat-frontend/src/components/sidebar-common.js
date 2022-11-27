import { useLocation } from "react-router-dom";
import React, { useContext, useEffect, useState, useRef } from "react";
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
import { slide as Menu } from "react-burger-menu";

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
	const roomEndRef = useRef(null);
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

		if (isPublic) {
			setPrivateMemberMsg(null);
		}
		// dispatch for notifications
		dispatch(resetNotifications(room));
	}

	socket.off("notifications").on("notifications", (room) => {
		if (currentRoom !== room._id) dispatch(addNotifications(room));
	});
	// socket.off("notifications").on("notifications", (roomNew) => {
	// 	if (currentRoom !== roomNew._id) dispatch(addNotifications(roomNew));
	// });

	useEffect(() => {
		scrollToBottom();
	}, [rooms]);

	function scrollToBottom() {
		roomEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
		});
	}
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
	// socket.off("message").on("message");

	function getRooms() {
		fetch("http://localhost:5001/rooms")
			.then((res) => res.json())
			.then((data) => getAppRooms(data));
		// socket.emit("message");
	}

	if (!user) {
		return <></>;
	}

	socket.off("room-new").on("room-new", (roomNew) => {
		getAppRooms(roomNew);
	});
	function addRoom(e, room) {
		e.preventDefault();
		if (!newRoomName) return;
		const roomId = currentRoom;
		const newRoomType = locationText;
		const newRoomUser = user._id;
		// const newRoomName = room.roomName;
		socket.emit(
			"new-room",
			roomId,
			newRoomName,
			newRoomUser,
			newRoomType,
			newRoomDate,
			newRoomDescription,
			user
		);
		setNewRoomName("");
		getRooms();
		setCurrentRoom(currentRoom);
		setShow(false);
		// axios
		// 	.post("http://localhost:5001/rooms/", {
		// 		roomName: newRoomName,
		// 		roomType: locationText,
		// 		roomDate: newRoomDate,
		// 		roomUser: user._id,
		// 		roomDescription: newRoomDescription,
		// 	})
		// 	.then((res) => {
		// 		getRooms();
		// 		setCurrentRoom(currentRoom);
		// 		setShow(false);
		// 	});
	}

	return (
		<>
			<Menu pageWrapId={"page-wrap"}>
				<main id="page-wrap">
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
											room.roomName === "Lobby" &&
											room.roomType === locationText
									)
									.map((room, LobbyIdx) => (
										<div key={LobbyIdx}>
											<ListGroup.Item
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
													<h5 className="list-info__header mb-0">
														{room.roomName}
													</h5>
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
															room.roomName !== "Lobby" &&
															room.roomType === locationText
													)
													.map((room, listIdx) => (
														<div key={listIdx} ref={roomEndRef}>
															<ListGroup.Item
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
																	<h5 className="list-info__header">
																		{room.roomName}
																	</h5>
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
															room.roomName !== "Lobby" &&
															room.roomType === locationText &&
															moment(room.roomDate).unix() >
																moment().format("X")
													)
													.sort(
														(a, b) =>
															moment(a.roomDate).format("X") -
															moment(b.roomDate).format("X")
													)
													.map((room, sortListIdx) => (
														<div key={sortListIdx}>
															<ListGroup.Item
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
																	<h5 className="list-info__header">
																		{room.roomName}
																	</h5>
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
															room.roomName !== "Lobby" &&
															room.roomType === locationText &&
															user._id === room.roomUser
													)
													.map((room, myListIdx) => (
														<div key={myListIdx}>
															<ListGroup.Item
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
																	<h5 className="list-info__header">
																		{room.roomName}
																	</h5>
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
				</main>
			</Menu>
		</>
	);
}

export default SidebarCommon;
