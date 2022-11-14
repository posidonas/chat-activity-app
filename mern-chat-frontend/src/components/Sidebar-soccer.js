import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import SidebarCommon from "./sidebar-common";

function Sidebar() {
	const { socket, setCurrentRoom } = useContext(AppContext);
	useEffect(() => {
		setCurrentRoom("63655448f7338f2adc46b2ee");
		socket.emit("join-room", "63655448f7338f2adc46b2ee");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<SidebarCommon />
		</>
	);
}

export default Sidebar;
