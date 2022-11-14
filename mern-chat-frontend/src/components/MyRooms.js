import axios from 'axios';
import React, {useContext, useEffect, useState} from "react";
import {
    Modal,
    Form,
    Button,
    Col,
    ListGroup,
    Row
} from "react-bootstrap";
import {useSelector} from "react-redux";
import {AppContext} from "../context/appContext";

import * as dayjs from 'dayjs'
import MomentUtils from '@date-io/date-fns'; // choose your lib
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'

import "./myRooms.css";

function MyRoomList(room) {

    const user = useSelector((state) => state.user);
    const moment = require('moment');

    const {setCurrentRoom, getAppRooms, rooms, currentRoom} = useContext(AppContext);
    const [newRoomName, setNewRoomName] = useState("");
    const [newRoomDate, setNewRoomDate] = useState(new Date());
    const [newRoomDescription, setNewRoomDescription] = useState('');

    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => {
        setShowEdit(false);
    }
    function handleShowEdit(room) {

        // rooms.filter(room => room._id === currentRoom ).map((room) => {
        //     return setNewRoomName(room.room);
        // })
        // rooms.filter(room => room._id === currentRoom ).map((room) => {
        //     return setNewRoomDate(room.roomDate);
        // })
        console.log('edit room')
        setShowEdit(true);
    }

    function joinRoom(room) {
        if (! user) {
            return alert("Please login");
        }
        setCurrentRoom(room);
        console.log('join room')


    }
    useEffect(() => {
        if (user) {
            getRooms();
            setNewRoomName("")
            setNewRoomDate(dayjs())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getRooms() {
        fetch("http://localhost:5001/rooms").then((res) => res.json()).then((data) => getAppRooms(data))
    }

    if (! user) {
        return <></>;
    }
    const deleteAppRoom = (id) => {
        axios.delete(`http://localhost:5001/rooms/${id}`).then(res => {
            getRooms();
            setCurrentRoom("Lobby");
        })
    }

    function updateAppRoom(e, id) {
        e.preventDefault();
        axios.put(`http://localhost:5001/rooms/${id}`, {
            room: newRoomName,
            roomDate: newRoomDate,
            roomDescription: newRoomDescription
        }).then(res => {
            getRooms();
        })
    }

    return (
        <div>
            <h1 className="my-5">My Rooms:</h1>
            <ListGroup className="roomsListGroup mb-5">
                {/* Hiking */}
                <div className='listItemWrapper mb-5'>
                    {
                    rooms.filter(room => user._id === room.roomUser && room.room !== "Lobby" && room.roomType === "Hiking").map((room, listIdxHiking) => (
                        <div key={listIdxHiking}
                            id="hikingRoom"
                            className="roomsListItem">
                            {
                            listIdxHiking === 0 && <h2 className="mb-3">Hiking</h2>
                        }
                            <ListGroup.Item className="listItem"
                                onClick={
                                    () => joinRoom(room._id)
                                }
                                active={
                                    room._id === currentRoom
                                }
                                style={
                                    {
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }
                            }>
                                <div className="list-info pe-3">
                                    <h5>{
                                        room.room
                                    }</h5>
                                    <div>
                                        <span className="me-3">
                                            {
                                            room.room !== 'Lobby' && `${
                                                moment(room.roomDate).format('dddd: DD-MM-YYYY HH:mm')
                                            }`
                                        }</span>
                                        {
                                        room.roomDescription ? <i data-bs-toggle="tooltip" effect="solid" data-bs-placement="bottom"
                                            title={
                                                room.roomDescription
                                            }
                                            className="fas fa-info-circle"></i> : ""
                                    } </div>
                                </div>
                                <div>
                                    <span className="me-3"
                                        onClick={handleShowEdit}>
                                        <i className="fas fa-pen-to-square"></i>
                                    </span>
                                    <span onClick={
                                        () => deleteAppRoom(room._id)
                                    }>
                                        <i className="fas fa-times"></i>
                                    </span>
                                </div>
                            </ListGroup.Item>
                        </div>
                    ))
                } </div>
                {/* Soccer */}
                <div className='listItemWrapper mb-5'>
                    {
                    rooms.filter(room => user._id === room.roomUser && room.room !== "Lobby" && room.roomType === "Soccer").map((room, listIdxSoccer) => (
                        <div key={listIdxSoccer}
                            id="soccerRoom"
                            className="roomsListItem">
                            {
                            listIdxSoccer === 0 && <h2 className="mb-3">Soccer</h2>
                        }
                            <ListGroup.Item className="listItem"
                                onClick={
                                    () => joinRoom(room._id)
                                }
                                active={
                                    room._id === currentRoom
                                }
                                style={
                                    {
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }
                            }>
                                <div className="list-info pe-3">
                                    <h5>{
                                        room.room
                                    }</h5>
                                    <div>
                                        <span className="me-3">
                                            {
                                            room.room !== 'Lobby' && `${
                                                moment(room.roomDate).format('dddd: DD-MM-YYYY HH:mm')
                                            }`
                                        }</span>
                                        {
                                        room.roomDescription ? <i data-bs-toggle="tooltip" effect="solid" data-bs-placement="bottom"
                                            title={
                                                room.roomDescription
                                            }
                                            className="fas fa-info-circle"></i> : ""
                                    } </div>
                                </div>
                                <div>
                                    <span className="me-3"
                                        onClick={
                                            () => handleShowEdit(room._id)
                                    }>
                                        <i className="fas fa-pen-to-square"></i>
                                    </span>
                                    <span onClick={
                                        () => deleteAppRoom(room._id)
                                    }>
                                        <i className="fas fa-times"></i>
                                    </span>
                                </div>
                            </ListGroup.Item>
                        </div>
                    ))
                } </div>
            </ListGroup>
            {
            rooms.filter(room => (room._id === currentRoom)).map((room, editIdx) => (
                <Modal key={editIdx}
                    show={showEdit}
                    onHide={
                        () => handleCloseEdit()
                }>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="roomFormEdit"
                            onSubmit={
                                e => updateAppRoom(e, room._id)
                        }>
                            <Row>
                                <Col md={12}
                                    className='mb-3'>
                                    <Form.Group className="d-flex flex-column">
                                        <Form.Control className="mb-3" type="text"
                                            placeholder={
                                                room.room
                                            }
                                            value={newRoomName}
                                            onChange
                                            ={(e) => setNewRoomName(e.target.value)}></Form.Control>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <DateTimePicker label="Time of Event" inputVariant="outlined"
                                                value={newRoomDate}
                                                format="dd-MM-yyyy HH:MM"
                                                disablePast
                                                onChange={
                                                    (newDate) => {
                                                        setNewRoomDate(newDate);
                                                    }
                                                }
                                                showTodayButton/>
                                        </MuiPickersUtilsProvider>
                                    <Form.Control className="mb-3" type="text" placeholder="Description"
                                        value={newRoomDescription}
                                        onChange
                                        ={(event) => setNewRoomDescription(event.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={3}>

                                <Button id="form-btn-edit" type="submit" variant="primary"
                                    onClick={
                                        () => handleCloseEdit()
                                }>
                                    Save
                                    <i className="fas fa-paper-plane"></i>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
            ))
        } </div>


    );
}

export default MyRoomList;
