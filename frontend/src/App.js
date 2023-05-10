import React from "react";
import { BrowserRouter as Router, Routes , Route} from "react-router-dom";


import Home from "./components/Home";
import QA from "./components/QA";
import Summarize from "./components/Summarize";
import Transcribe from "./components/Transcribe";
import Sentiment from "./components/Sentiment";
import Keyword from "./components/Keyword";




function App() {
  return (
    <>
      {/* This is the alias of BrowserRouter i.e. Router */}
      <Router>
        <Routes >
          <Route exact path="/home" element={<Home />} />
          <Route path="/qa" element={<QA />} />
            <Route path="/summarize" element={<Summarize />} />
            <Route path="/transcribe" element={<Transcribe />}/>
          <Route path="/sentiment" element={<Sentiment />}/>
          <Route path="/keyword" element={<Keyword />}/>

        </Routes >
      </Router>
    </>
  );
}

export default App;