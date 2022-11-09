import axios from 'axios';
import { useLocation } from 'react-router-dom'
import React, { useRef, useContext, useEffect, useState } from "react";
import { Modal, Form, Button, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
// import BasicDateTimePicker from "./datepicker"
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import "./Sidebar.css";

function SidebarCommon(){
        const moment = require('moment');

        const location = useLocation();
        const locationText = location.pathname.replace('/', '').charAt(0).toUpperCase() + location.pathname.slice(2);
    
        const user = useSelector((state) => state.user);

        const dispatch = useDispatch();
        const { socket, setMembers, members, setCurrentRoom, getAppRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom} = useContext(AppContext);


        const [newRoomName, setNewRoomName] = useState('');
        
        const [newRoomDate, setNewRoomDate] = useState(dayjs());

        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

 
        function joinRoom(room, isPublic = true) {
            if (!user) {
                return alert("Please login");
            }
            socket.emit("join-room", room, currentRoom);
            setCurrentRoom(room);
            console.log('join room')

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
            }
           
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    
        socket.off("new-user").on("new-user", (payload) => {
            setMembers(payload);
        });
    
        function getRooms() {
            fetch("http://localhost:5001/rooms")
                .then((res) => res.json())
                .then((data) => getAppRooms(data))
        }
        
        function orderIds(id1, id2) {
            if (id1 > id2) {
                return id1 + "-" + id2;
            } else {
                return id2 + "-" + id1;
            }
        }
    
        function handlePrivateMemberMsg(member) {
            setPrivateMemberMsg(member);
            const roomId = orderIds(user._id, member._id);
            joinRoom(roomId, false);
        }
    
        if (!user) {
            return <></>;
        }
    
        function addRoom(e) {
            e.preventDefault();
            axios.post('http://localhost:5001/rooms/',{
                room: newRoomName,
                roomType: locationText,
                roomDate: newRoomDate,
                roomUser: user._id
            }).then(res => {
                getRooms();
              })
        }
        
    
        return (
            <>
                <h2 className="mb-3">{locationText} Rooms</h2>
                <ListGroup className="mb-5">
                    {rooms.filter(room => (room.roomType === locationText) || ((room.room === "Lobby")&& room.roomType === locationText) ).map((room, listIdx) => (
                      <div key={listIdx} >
                        <ListGroup.Item id={"listIdxRoom" + listIdx} className="listItem" onClick={() => joinRoom(room._id)} active={room._id === currentRoom } style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                            <div className="list-info pe-3"><h5 className="list-info__header">{room.room}</h5>{room.room !== 'Lobby' && `${moment(room.roomDate).format('dddd: DD-MM-YYYY hh:mm a')}`}</div>
                            {currentRoom !== room._id && <span className="badge__custom badge rounded-pill bg-dark">{user.newMessages[room._id]}</span>}
                            {user._id === room.roomUser && <a className="ribbon-owner" title="Go to Rooms Edit" href="/rooms/myrooms">Owner</a>}
                            
                            
                        </ListGroup.Item>
                    </div>
                        
                    ))}
    
                     <Button className="mt-3" variant="dark gradient" onClick={handleShow}>
                        Add NewRoom
                    </Button>
    
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add a Room</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form id="roomForm" onSubmit={addRoom}>
                                <Row>
                                    <Col md={12} className='mb-3'>
                                        <Form.Group className="d-flex flex-column">
                                            <Form.Control className="mb-3" type="text" placeholder="Room Name" value={newRoomName} onChange ={(event) => setNewRoomName(event.target.value)}></Form.Control>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateTimePicker
                                                        renderInput={(props) => <TextField {...props} />}
                                                        label="Event Time"
                                                        inputFormat="dddd: DD-MM-YYYY hh:mm a"
                                                        value={newRoomDate}
                                                        onChange={(newDate) => {
                                                            setNewRoomDate(newDate);
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                    
                                       
                                        <Button id="form-btn" type="submit" variant="primary" onClick={handleClose}>
                                            Save <i className="fas fa-paper-plane"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                </ListGroup>
                <h2 className="mb-3">Members</h2> 
                {members.map((member, memberIdx) => (
                    <ListGroup.Item key={memberIdx} style={{ cursor: "pointer" }} active={privateMemberMsg?._id === member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id}>
                        <Row>
                            <Col xs={2} className="member-status">
                                <img src={member.picture} className="member-status-img" alt="img avatar" />
                                {member.status === "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
                            </Col>
                            <Col xs={9}>
                                {member.name}
                                {member._id === user?._id && " (You)"}
                                {member.status === "offline" && " (Offline)"}
                            </Col>
                            <Col xs={1}>
                                <span className="badge rounded-pill bg-primary">{user.newMessages[orderIds(member._id, user._id)]}</span>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </>
        );
    

}

export default SidebarCommon;