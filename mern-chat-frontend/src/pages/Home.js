import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

function Home() {
    return (
        <Row>
            <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
                <div>
                    <h1>Time to get Active!</h1>
                    <p>Connect with the world</p>
                    <LinkContainer to="/soccer">
                        <Button className='me-3' variant="success">
                            Soccer <i className="fas fa-comments home-message-icon"></i>
                        </Button>
                    </LinkContainer>
                    <LinkContainer to="/hiking">
                        <Button variant="success">
                            Hiking <i className="fas fa-comments home-message-icon"></i>
                        </Button>
                    </LinkContainer>
                </div>
            </Col>
            <Col md={6} className="home__bg"></Col>
        </Row>
    );
}

export default Home;
