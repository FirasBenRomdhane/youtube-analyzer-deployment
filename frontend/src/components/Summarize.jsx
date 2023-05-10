import React, { useState, useEffect, useRef } from "react";
import './Summarize.css';
import {Container, Form} from "react-bootstrap";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Navibar from "./Navibar"
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";

const Summarize= () => {



    return (
        <>

            <header>
                <Navibar />
            </header>
            <div className="container-background1">
                <Container fluid >
                    <Row className="px-4 my-5">
                        <Card className="text-center text-light bg-transparent my-5 py-4">
                            <Card.Header as="h5">Text Summarization</Card.Header>
                            <Card.Body>
                                <Card.Title>Input the text you would like to be summarized:</Card.Title>
                                <Card.Text>
                                    <br/>
                                    <form>
                                        <input type="text"  /><br/><br/>
                                        { <Button variant="danger" type="submit"  id="submit-btn">Summarize</Button>}
                                    </form>

                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </Row>
                    <Row className="px-4 my-5">
                        <div className="messages" >
                        </div>
                    </Row>
                </Container>
            </div>

        </>
    );
};

export default Summarize;