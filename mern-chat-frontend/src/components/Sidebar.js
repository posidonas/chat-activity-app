import axios from 'axios';
import { useLocation } from 'react-router-dom'
import Popup from 'reactjs-popup';
import React, { useContext, useEffect, useState } from "react";
import { Modal, Form, Button, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";


import "./Sidebar.css";

function Sidebar() {
    const location = useLocation();

    const locationText = location.pathname.replace('/', '').charAt(0).toUpperCase() + location.pathname.slice(2);


    console.log(locationText);

    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const { socket, setMembers, members, setCurrentRoom, getAppRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);
    const [newRoomName, setNewRoomName] = useState('');
    const [show, setShow] = useState(false);

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
        if (currentRoom !== room) dispatch(addNotifications(room));
    });

    useEffect(() => {
        if (user) {
            setCurrentRoom("Lobby");
            getRooms();
            socket.emit("join-room", "Lobby");
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
            .then((data) => getAppRooms(data));
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
            roomType: locationText
        }).then(res => {  
            getRooms();
            setNewRoomName('');
          })
    }
    
    const deleteAppRoom = (id) => {
        axios.delete(`http://localhost:5001/rooms/${id}`).then(res => {  
            getRooms();
            setCurrentRoom("Lobby");
          })  
    }

    return (
        <>
            <h2>Welcome to The {locationText} Lobby</h2>
            
            <ListGroup>

                {rooms.filter(room => room.roomType === locationText || room.room === "Lobby").map((room) => (
                  
                    <ListGroup.Item className="listItem" key={room.id} onClick={() => joinRoom(room.room)} active={room.room === currentRoom } style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                        {room.room} {currentRoom !== room.room && <span className="badge rounded-pill bg-primary">{user.newMessages[room.room]}</span>}
                        {room.room !== 'Lobby' &&
                        <button onClick={() => deleteAppRoom(room._id)}>Delete</button>
                        }
                    </ListGroup.Item>
                    
                ))}
                 <Button className="mt-3" variant="primary" onClick={handleShow}>
                    Add Room
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add a Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="roomForm" onSubmit={addRoom}>
                            <Row>
                                <Col md={12} className='mb-3'>
                                    <Form.Group>
                                        <Form.Control type="text" placeholder="Room Name" value={newRoomName} onChange ={(event) => setNewRoomName(event.target.value)}></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                
                                   
                                    <Button id="form-btn" type="submit" variant="primary" onClick={handleClose}>
                                        Save <i className="fas fa-paper-plane"></i>
                                    </Button>
                                </Col>
                            </Row>
                    `</Form>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                
            </ListGroup>
            <h2>Members</h2> 
            {members.map((member) => (
                <ListGroup.Item key={member.id} style={{ cursor: "pointer" }} active={privateMemberMsg?._id === member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id}>
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

export default Sidebar;