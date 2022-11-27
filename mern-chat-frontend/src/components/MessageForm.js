import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { Scrollbars } from "react-custom-scrollbars-2";
import "./MessageForm.css";
function MessageForm() {
	const location = useLocation();
	const locationText =
		location.pathname.replace("/", "").charAt(0).toUpperCase() +
		location.pathname.slice(2);

	const [message, setMessage] = useState("");

	const user = useSelector((state) => state.user);
	const {
		socket,
		currentRoom,
		setMessages,
		messages,
		privateMemberMsg,
		rooms,
	} = useContext(AppContext);
	const messageEndRef = useRef(null);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	function getFormattedDate() {
		const date = new Date();
		const year = date.getFullYear();
		let month = (1 + date.getMonth()).toString();

		month = month.length > 1 ? month : "0" + month;
		let day = date.getDate().toString();

		day = day.length > 1 ? day : "0" + day;

		return month + "/" + day + "/" + year;
	}

	function scrollToBottom() {
		messageEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "start",
		});
	}

	const todayDate = getFormattedDate();

	socket.off("room-messages").on("room-messages", (roomMessages) => {
		setMessages(roomMessages);
	});

	function handleSubmit(e) {
		e.preventDefault();
		if (!message) return;
		const today = new Date();
		const minutes =
			today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
		const time = today.getHours() + ":" + minutes;
		const roomId = currentRoom;
		const messageRoomType = locationText;
		socket.emit(
			"message-room",
			roomId,
			message,
			user,
			time,
			todayDate,
			messageRoomType
		);
		setMessage("");
	}

	return (
		<>
			<Row>
				<Col md={12}>
					{user && !privateMemberMsg?._id && (
						<div className="main-topbar__welcome message-alert alert alert-light">
							{rooms
								.filter((room) => room._id === currentRoom)
								.map((room, welcomeidx) => (
									<span key={welcomeidx}>
										<strong>{room.roomName}</strong> chat.
									</span>
								))}
						</div>
					)}
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					{user && privateMemberMsg?._id && (
						<>
							<div className="main-topbar__welcome alert alert-light conversation-info">
								<div className="user__conversation">
									Your conversation with {privateMemberMsg.name}{" "}
									<img
										src={privateMemberMsg.picture}
										className="conversation-profile-pic"
										alt="Message Avatar"
									/>
								</div>
							</div>
						</>
					)}
					{!user && <div className="alert alert-danger">Please login</div>}
				</Col>
			</Row>
			<Row>
				<Col md={12} className="gx-md-4">
					<div className="messages-output">
						<Scrollbars
							autoHeight
							autoHeightMin={`calc(100vh - 120px)`}
							autoHeightMax={`calc(-129px + 100vh)`}
						>
							{user &&
								messages.map(({ _id: date, messagesByDate }, messageidx) => (
									<div key={messageidx}>
										<p className="text-center message-date-indicator">{date}</p>
										{messagesByDate?.map(
											({ content, time, from: sender }, msgIdx) => (
												<div
													className={
														sender?.email === user?.email
															? "message"
															: "incoming-message"
													}
													key={msgIdx}
												>
													<div className="d-flex align-items-center">
														<div className="message-inner">
															<p className="message-content mb-0">{content}</p>
															<p className="message-timestamp-left">{time}</p>
														</div>
													</div>
													<div className="messageUserInfo d-flex align-items-start flex-column mb-3">
														<img
															src={sender.picture}
															style={{
																width: 35,
																height: 35,
																objectFit: "cover",
																borderRadius: "50%",
																marginRight: 10,
															}}
															alt="Sender Avatar"
														/>
														<p className="message-sender mb-4">
															{sender._id === user?._id ? "You" : sender.name}
														</p>
													</div>
												</div>
											)
										)}
									</div>
								))}
							<div ref={messageEndRef} />
						</Scrollbars>
					</div>
					<Form onSubmit={handleSubmit}>
						<Row>
							<Col md={12}>
								<Form.Group>
									<div className="message-input mb-5">
										<Form.Control
											type="text"
											placeholder="Your message"
											disabled={!user}
											value={message}
											onChange={(e) => setMessage(e.target.value)}
										></Form.Control>
										<Button
											variant="dark gradient"
											type="submit"
											style={{ width: "100%" }}
											disabled={!user}
										>
											<i className="fas fa-paper-plane"></i>
										</Button>
									</div>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
		</>
	);
}

export default MessageForm;
