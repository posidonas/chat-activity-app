import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import SidebarCommon from "./sidebar-common";

function Sidebar() {
	const { socket, setCurrentRoom } = useContext(AppContext);
	useEffect(() => {
		setCurrentRoom("63d42585d42362fdcda9fb57");
		socket.emit("join-room", "63d42585d42362fdcda9fb57");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<SidebarCommon />
		</>
	);
}

export default Sidebar;
