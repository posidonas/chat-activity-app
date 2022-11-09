import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MyRoomList from "../components/MyRooms";


function RoomList() {


    return (
        <Container>
            <Row>
                <Col md={12}>
                    <MyRoomList />
                </Col>
            </Row>
        </Container>
    );
}

export default RoomList;
