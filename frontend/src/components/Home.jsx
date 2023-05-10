import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import './Home.css';
import {Container} from "react-bootstrap";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import page from "../images/page.jpg"
import Navibar from "./Navibar"
import Card from "react-bootstrap/Card";
import QA_Image from "../images/QA.jpg"
import TS_Image from "../images/Transcription.png"
import KW_Image from "../images/KW.png"
import Sum_Image from "../images/Summary.jpeg"
import SA_Image from "../images/SA.jpeg"
import {Link} from "react-router-dom";




const Home = () => {

    const [text, setText] = useState('');
    const [webSocket, setWebSocket] = useState(null);
    const [response, setResponse] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('');
    const messagesRef = useRef(null);


    useEffect(()=>{
        const newWebSocket = new WebSocket('ws://localhost:8000/transcribe');
        setWebSocket(newWebSocket);


        return ()=>{
            newWebSocket.close()
        }
    },[])

    const handleTextChange = (event)=>{
        setText(event.target.value);
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        messagesRef.current.style.opacity=1;
        webSocket.send(text);
    }

    useEffect(()=>{

        const handleResponse = (event)=>{
            const messages_container = document.querySelector('.messages-container');
            //const home_container = document.querySelector('.home-container');
            setResponse(event.data)


            if (event.data !== "done"){
                messages_container.innerHTML="";
                const p = document.createElement('p');
                const text = document.createTextNode(event.data);
                p.appendChild(text);
                messages_container.appendChild(p);
                
            }else{
            
        
                const a = document.createElement('a');
                const text = document.createTextNode('QA');
                const button = document.createElement('button');
        
                a.href = "/qa";
        
                button.appendChild(text);
                a.appendChild(button);
                messages_container.appendChild(a);
        
            }
        };

        if (webSocket){
            webSocket.addEventListener('message',handleResponse);
        };
    },[webSocket]);


    useEffect(() => {
        const handleOpen = () => {
          setConnectionStatus('Connected');
        };
    
        const handleClose = () => {
          setConnectionStatus('Disconnected');
        };
    
        if (webSocket) {
          webSocket.addEventListener('open', handleOpen);
          webSocket.addEventListener('close', handleClose);
        }
    
        return () => {
          if (webSocket) {
            webSocket.removeEventListener('open', handleOpen);
            webSocket.removeEventListener('close', handleClose);
          }
        };
      }, [webSocket]);


    return (



        <>
            <header>
                <Navibar />

            </header>

            <Container fluid className="bg-dark text-light p-5 border-top border-danger">
                <Row className="px-4 my-5">
                    <Col sm={7}>
                        <Image
                            src={page}
                            width="900"
                            height="400"
                            fluid
                            rounded
                            />
                    </Col>
                    <Col sm={5}>
                        <br/>
                        <h1 className="font-weight-light">Welcome to Info-Miner!</h1>
                        <p className="mt-4">
                            Introducing our AI-powered video transcription and analysis service! With this service, you can easily convert any video into accurate and searchable text, extract relevant keywords, and obtain a summary of the content.
                            <br/>
                            <br/>
                            But that's not all! Our service also offers advanced features such as question answering and sentiment analysis. You can quickly find answers to specific questions related to the video content and gain insights into the sentiment expressed in the video.
                        </p>



                    </Col>

                </Row>
            </Container>

            <Container fluid className="border-top border-danger">
                <Row className="px-4 my-5 ">
                    <Col className="d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={TS_Image} height="175px"/>
                            <Card.Body>
                                <Card.Title>Video to Text</Card.Title>
                                <Card.Text>
                                    Create a textual transcript of a video of your choice in mere seconds
                                </Card.Text>
                                <Link to="/transcribe"><Button variant="danger">Transcribe >></Button></Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col className="d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={QA_Image} height="175px" />
                            <Card.Body>
                                <Card.Title>Question Answering</Card.Title>
                                <Card.Text>
                                    Give our model a paragraph and ask a question related to your input for a precise answer
                                </Card.Text>
                                <Link to="/QA"><Button variant="danger">Ask a question >></Button></Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col className="d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={KW_Image} height="175px" />
                            <Card.Body>
                                <Card.Title>Keyword Extraction</Card.Title>
                                <Card.Text>
                                    Extract the relevant keywords present in the most complex documents
                                </Card.Text>
                                <Link to="/Keyword"><Button variant="danger">Extract >></Button></Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="px-4 my-5 ">
                    <Col className="d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={SA_Image} height="175px" />
                            <Card.Body>
                                <Card.Title>Sentiment Analysis</Card.Title>
                                <Card.Text>
                                    Understand the intentions and emotions of the speakers throughout their dialogue
                                </Card.Text>
                                <Link to="/Sentiment"><Button variant="danger">Analyse >></Button></Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col className="d-flex justify-content-center">
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={Sum_Image} height="175px"  />
                            <Card.Body>
                                <Card.Title>Summarization</Card.Title>
                                <Card.Text>
                                    Summarize papers, meet recording and long lessons into comprehensive abstracts
                                </Card.Text>
                                <Link to="/Summarize"><Button variant="danger">Summarize >></Button></Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>
            {/*
            <Container fluid>
                <Row className="px-4 my-5">

                    <Card className="text-center my-5 py-4">
                        <Card.Header as="h5">Transcribe Video to Text</Card.Header>
                        <Card.Body>
                            <Card.Title>Input the URL of your video:</Card.Title>
                            <Card.Text>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" value={text} onChange={handleTextChange} /><br/><br/>
                                    { <Button variant="danger" type="submit">Transcribe</Button>}
                                    {
                                        //connectionStatus === 'Connected' &&
                                    }
                                </form>

                                <div className="messages-container" ref={messagesRef}></div>
                            </Card.Text>

                        </Card.Body>
                    </Card>


                </Row>
            </Container>
            */}
            <footer className="bg-dark text-center py-4 mt-5">
                <Container className="px-5">
                    <a href="https://aispektra.blogspot.com/p/home.html" target="_blank" rel="noopener noreferrer">Check our previous projects</a>
                </Container>
            </footer>


        </>

    );
};

export default Home