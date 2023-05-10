import React, { useState, useEffect, useRef } from "react";
import './QA.css';
import {Container, Form} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Navibar from "./Navibar"
import Card from "react-bootstrap/Card";


const QA = () => {

  const [text, setText] = useState('');
  const [webSocket, setWebSocket] = useState(null);
  const [response, setResponse] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');

  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const submitRef = useRef(null);



  useEffect(() => {
    const newWebSocket = new WebSocket('ws://localhost:8000/qa');
    setWebSocket(newWebSocket);


    return () => {
      newWebSocket.close();
    };
  }, []);




  const handleQATextChange = (event) => {
    setText(event.target.value);
  };

  const handleQASubmit = (event) => {
    event.preventDefault();

    inputRef.current.value = '';

    const p = document.createElement('p');
    const content = document.createTextNode('me: ' + text);

    p.appendChild(content);

    p.className = 'user-message';

    messagesRef.current.append(p);
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

    webSocket.send(text);
  }

  useEffect(() => {
    const handleResponse = (event) => {
      setResponse(event.data);

      const p = document.createElement('p');
      const content = document.createTextNode('them: ' + event.data);

      p.appendChild(content);
      p.className = 'lm-message';


      messagesRef.current.append(p);

      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;

    };

    if (webSocket) {
      webSocket.addEventListener('message', handleResponse);
    }

    return () => {
      if (webSocket) {
        webSocket.removeEventListener('message', handleResponse);
      }
    };
  }, [webSocket]);

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
      <div className="container-background">
      <Container fluid >
        <Row className="px-4 my-5">
          <Card className="text-center text-light bg-transparent my-5 py-4">
            <Card.Header as="h5">Question Answering</Card.Header>
            <Card.Body>
              <Card.Title>Ask the model your question:</Card.Title>
              <Card.Text>
                <br/>
                <form onSubmit={handleQASubmit}>
                  <input type="text" ref={inputRef} value={text} onChange={handleQATextChange} /><br/><br/>
                  { <Button variant="danger" type="submit" ref={submitRef} id="submit-btn">Ask</Button>}
                </form>

              </Card.Text>

            </Card.Body>
          </Card>
        </Row>
        <Row className="px-4 my-5">
          <div className="messages" ref={messagesRef}>
          </div>
        </Row>
      </Container>
      </div>

    </>
  );
};

export default QA;