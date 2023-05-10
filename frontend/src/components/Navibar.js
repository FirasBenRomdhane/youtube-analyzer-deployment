import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {LinkContainer} from 'react-router-bootstrap'
import logo1 from "../images/Info3.svg";
import {Link} from "react-router-dom";

function Navibar() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand >
                    <Link to="/home">
                        <img width="120" height="auto" className="img-responsive" src={logo1}  alt="logo1" />

                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/home"><Nav.Link >Home</Nav.Link></LinkContainer>
                        <Nav.Link href="https://spektravie.blogspot.com/2023/04/extracting-relevant-information-from.html" target="_blank" rel="noopener noreferrer">Blog</Nav.Link>
                        <NavDropdown title="Services" id="basic-nav-dropdown">
                            <NavDropdown.Item ><Link className="text-dark text-decoration-none" to="/transcribe">Transcribe</Link></NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item >
                                <Link className="text-dark text-decoration-none" to="/qa"> Question Answering</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item><Link className="text-dark text-decoration-none" to="/sentiment">Sentiment Analysis</Link></NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item><Link className="text-dark text-decoration-none" to="/keyword">Keyword Extraction</Link></NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item><Link className="text-dark text-decoration-none" to="/summarize">Summarization</Link></NavDropdown.Item>


                        </NavDropdown>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navibar;