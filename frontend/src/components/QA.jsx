import React, { useState, useEffect, useRef } from "react";
import './QA.css';

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
      <div className="qa-container">
      <a href="/home">Home</a>
        <div className="messages" ref={messagesRef}>
        </div>
        <form onSubmit={handleQASubmit}>
          <input type="text" ref={inputRef} value={text} onChange={handleQATextChange} />
          {connectionStatus === 'Connected' && <button type="submit" ref={submitRef} id="submit-btn">Ask</button>}
        </form>

      </div>
    </>
  );
};

export default QA;