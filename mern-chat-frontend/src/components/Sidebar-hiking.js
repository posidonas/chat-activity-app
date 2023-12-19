import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import SidebarCommon from "./sidebar-common";

function Sidebar() {
	const { socket, setCurrentRoom } = useContext(AppContext);
	useEffect(() => {
		setCurrentRoom("6394f6694558774befb65c4b");
		socket.emit("join-room", "6394f6694558774befb65c4b");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<SidebarCommon />
		</>
	);
}

export default Sidebar;
