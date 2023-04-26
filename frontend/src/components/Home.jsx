import React, { useState, useEffect } from "react";


const ws = new WebSocket("ws://localhost:8000/transcribe");

ws.onopen = () => {
    console.log("WebSocket connection established");
};

ws.onmessage = (event) => {
    console.log("Received message:", event.data);

    const div = document.querySelector('.container');
    const h1 = document.createElement('h1');
    const text = document.createTextNode(event.data);
    h1.appendChild(text);
    div.appendChild(h1);
    document.body.appendChild(div);
};

ws.onerror = (event) => {
    console.error("WebSocket error:", event);
};

ws.onclose = (event) => {
    console.log("WebSocket connection closed with code:", event.code);
};
const Home = () => {


    const [text, setText] = useState('');

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        ws.send(text);
    }



    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input type="text" value={text} onChange={handleTextChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Home