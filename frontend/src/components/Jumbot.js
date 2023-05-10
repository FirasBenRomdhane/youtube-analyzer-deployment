import Container from "react-bootstrap/Container";
import React from "react";
import page from "../images/page.jpg"

function Jumbot(){
    return(
        <Container className="bg-dark text-light p-5">
            <h1>Welcome to Info-Miner!</h1>
            <br/>
            <p>An AI-powered service that uses several state-of-the-art models to extract relevant data from video recordings.</p>
        </Container>
    );
}

export default Jumbot;