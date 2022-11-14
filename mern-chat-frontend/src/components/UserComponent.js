import React, { useContext, useEffect } from "react";
import { Tooltip, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";

import "./Sidebar.css";

function UserComponent(props) {
	const user = useSelector((state) => state.user);

	const dispatch = useDispatch();
	const {
		socket,
		setMembers,
		members,
		setCurrentRoom,
		getAppRooms,
		privateMemberMsg,
		setPrivateMemberMsg,
		currentRoom,
	} = useContext(AppContext);

	function orderIds(id1, id2) {
		if (id1 > id2) {
			return id1 + "-" + id2;
		} else {
			return id2 + "-" + id1;
		}
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

	function getRooms() {
		fetch("http://localhost:5001/rooms")
			.then((res) => res.json())
			.then((data) => getAppRooms(data));
	}

	socket.off("new-user").on("new-user", (payload) => {
		setMembers(payload);
	});
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
	function handlePrivateMemberMsg(member) {
		setPrivateMemberMsg(member);
		const roomId = orderIds(user._id, member._id);
		joinRoom(roomId, false);
	}

	if (!user) {
		return <></>;
	}
	return (
		<>
			<Row>
				<Col md={12}>
					<h5 className="mb-5">Users</h5>
					{members.map((member, memberIdx) => (
						<ListGroup.Item
							className="user-list"
							key={memberIdx}
							style={{ cursor: "pointer" }}
							active={privateMemberMsg?._id === member?._id}
							onClick={() => handlePrivateMemberMsg(member)}
							disabled={member._id === user._id}
						>
							<Row>
								<Col xs={2} className="member-status">
									<img
										src={member.picture}
										className="member-status-img"
										alt="img avatar"
									/>{" "}
									{member.status === "online" ? (
										<i className="fas fa-circle sidebar-online-status"></i>
									) : (
										<i className="fas fa-circle sidebar-offline-status"></i>
									)}{" "}
								</Col>
								<Col xs={9}>
									{member.name}
									{member._id === user?._id && " (You)"}
									{member.status === "offline" && " (Offline)"}{" "}
								</Col>
								<Col xs={1}>
									<span className="badge rounded-pill bg-primary">
										{user.newMessages[orderIds(member._id, user._id)]}
									</span>
								</Col>
							</Row>
						</ListGroup.Item>
					))}{" "}
				</Col>
			</Row>
		</>
	);
}

export default UserComponent;
