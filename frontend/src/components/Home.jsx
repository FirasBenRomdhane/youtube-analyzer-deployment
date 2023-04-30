import React, { useState, useEffect, useRef } from "react";

import './Home.css';



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
            const home_container = document.querySelector('.home-container');
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
        <div className="home-container">
            <form onSubmit={handleSubmit}>
                <input type="text" value={text} onChange={handleTextChange} />
                {connectionStatus === 'Connected' && <button type="submit">Transcribe</button>}
            </form>
            <div className="messages-container" ref={messagesRef}></div>
        </div>
    );
};

export default Home