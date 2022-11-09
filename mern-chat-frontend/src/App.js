import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Soccer from "./pages/Soccer";
import Hiking from "./pages/Hiking";
import MyRoomList from "./pages/RoomList";
import { useSelector } from "react-redux";
import { useState } from "react";
import { AppContext, socket } from "./context/appContext";

function App() {
    const [rooms, getAppRooms] = useState([]);
    // const [messagesChat, getMessageRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState([]);
    const [roomName, setRoomName] = useState([]);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [privateMemberMsg, setPrivateMemberMsg] = useState({});
    const [newMessages, setNewMessages] = useState({});
    const user = useSelector((state) => state.user);
    
    return (
        <AppContext.Provider value={{ socket, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg, rooms, getAppRooms, newMessages, setNewMessages,roomName, setRoomName }}>
            <BrowserRouter>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {!user && (
                        <>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </>
                    )}
                    <Route path="/soccer" element={<Soccer />} />
                    <Route path="/hiking" element={<Hiking />} />
                    <Route path="/rooms/myrooms" element={<MyRoomList />} />

                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    );
}

export default App;
