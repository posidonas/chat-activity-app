import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar-soccer";
import MessageForm from "../components/MessageForm";

function Soccer() {
    return (
        <Container className="mt-5">
            <Row>
                <Col md={4}>
                    <Sidebar />
                </Col>
                <Col md={8}>
                    <MessageForm />
                </Col>
            </Row>
        </Container>
    );
}

export default Soccer;
