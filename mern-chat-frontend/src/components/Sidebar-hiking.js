import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import SidebarCommon from "./sidebar-common";

function Sidebar() {
	const { socket, setCurrentRoom } = useContext(AppContext);
	useEffect(() => {
		setCurrentRoom("6378a5a16633f456df0d0063");
		socket.emit("join-room", "6378a5a16633f456df0d0063");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<SidebarCommon />
		</>
	);
}

export default Sidebar;
