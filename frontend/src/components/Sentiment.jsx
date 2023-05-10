import React, { useState, useEffect, useRef } from "react";
import './Sentiment.css';
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Navibar from "./Navibar"
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";


const Sentiment = () =>{


    return(
        <>

            <header>
                <Navibar />
            </header>
            <div className="container-background3">
                <Container fluid >
                    <Row className="px-4 my-5">
                        <Card className="text-center text-light bg-transparent my-5 py-4">
                            <Card.Header as="h5">Sentiment Analysis</Card.Header>
                            <Card.Body>
                                <Card.Title>Input the document to be analyzed:</Card.Title>
                                <Card.Text>
                                    <br/>
                                    <form>
                                        <input type="text"  /><br/><br/>
                                        { <Button variant="danger" type="submit"  id="submit-btn">Analyse</Button>}
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


export default Sentiment;