import React from "react";
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/chatCtivitiesLogo.png";
import "./css/Navigation.css";
function Navigation() {
	const user = useSelector((state) => state.user);
	const [logoutUser] = useLogoutUserMutation();
	async function handleLogout(e) {
		e.preventDefault();
		await logoutUser(user);
		// redirect to home page
		window.location.replace("/");
	}
	return (
		<Navbar className="navbar--custom" expand="lg">
			<Container>
				<LinkContainer to="/">
					<Navbar.Brand>
						<img src={logo} style={{ width: 250 }} alt="Nav Avatar" />
					</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ms-auto">
						{!user && (
							<LinkContainer to="/login">
								<Nav.Link>Login</Nav.Link>
							</LinkContainer>
						)}

						{user && (
							<NavDropdown
								title={
									<>
										<img
											src={user.picture}
											style={{
												width: 30,
												height: 30,
												marginRight: 10,
												objectFit: "cover",
												borderRadius: "50%",
											}}
											alt="user Avatar"
										/>
										{user.name}
									</>
								}
								id="basic-nav-dropdown"
							>
								<NavDropdown.Item href="/myrooms">My Rooms</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.2">
									Another action
								</NavDropdown.Item>
								<NavDropdown.Item href="#action/3.3">
									Something
								</NavDropdown.Item>

								<NavDropdown.Item>
									<Button variant="danger" onClick={handleLogout}>
										Logout
									</Button>
								</NavDropdown.Item>
							</NavDropdown>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Navigation;
