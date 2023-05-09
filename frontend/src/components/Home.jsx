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

<<<<<<< Updated upstream
        <div>

        <div className="home-container">
            <form onSubmit={handleSubmit}>
                <input type="text" value={text} onChange={handleTextChange} />
                { <button type="submit">Transcribe</button>}
                {
                    //connectionStatus === 'Connected' &&
                }
            </form>
            <div className="messages-container" ref={messagesRef}></div>
        </div>
        </div>
=======

        <>
            <header>
                <Navibar />
            </header>

            <Container fluid>
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
                        <h1 className="font-weight-light">What is InfoMiner about?</h1>
                        <p className="mt-4">
                            Introducing our AI-powered video transcription and analysis service! With this service, you can easily convert any video into accurate and searchable text, extract relevant keywords, and obtain a summary of the content.
                            <br/>
                            <br/>
                            But that's not all! Our service also offers advanced features such as question answering and sentiment analysis. You can quickly find answers to specific questions related to the video content and gain insights into the sentiment expressed in the video.
                        </p>



                    </Col>

                </Row>
                <Row className="px-4 my-5">

                        <Card className="text-center my-5 py-4">
                            <Card.Header as="h5">Transcribe Video to Text</Card.Header>
                            <Card.Body>
                                <Card.Title>Input the URL of your video:</Card.Title>
                                <Card.Text>
                                    <form onSubmit={handleSubmit}>
                                        <input type="text" value={text} onChange={handleTextChange} /><br/><br/>
                                        { <Button variant="primary" type="submit">Transcribe</Button>}
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
            <footer className="bg-dark text-center py-4 mt-5">
                <Container className="px-5">
                    <a href="https://aispektra.blogspot.com/p/home.html">Check our previous projects</a>
                </Container>
            </footer>


        </>

>>>>>>> Stashed changes
    );
};

export default Home