import React from "react";
import { BrowserRouter as Router, Routes , Route} from "react-router-dom";


import Home from "./components/Home";
import QA from "./components/QA";




function App() {
  return (
    <>
      {/* This is the alias of BrowserRouter i.e. Router */}
      <Router>
        <Routes >
          <Route exact path="/home" element={<Home />} />
          <Route path="/qa" element={<QA />} />

        </Routes >
      </Router>
    </>
  );
}

export default App;