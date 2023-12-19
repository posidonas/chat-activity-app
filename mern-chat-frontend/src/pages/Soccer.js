import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar-soccer";
import UserComponent from "../components/UserComponent";
import MessageForm from "../components/MessageForm";

import "./roomPages.css";
function Soccer() {
	return (
		<Container fluid className="main-wrapper mt-3">
			<Row>
				<Col xl={3} className="sidebarBox gx-xl-0">
					<Sidebar />
				</Col>
				<Col xl={6} className="messageBox gx-xl-0">
					<MessageForm />
				</Col>
				<Col xl={3} className="userBox gx-xl-0">
					<h5 className="main-topbar__welcome message-alert alert alert-light mb-3">
						<UserComponent />
					</h5>
				</Col>
			</Row>
		</Container>
	);
}

export default Soccer;
