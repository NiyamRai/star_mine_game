// src/App.js
import React from "react";
import PhaserGame from "./components/PhaserGame";
import "./App.css";
import PheserDemo from "./components/PhaserDemo";

function App() {
  return (
    <div className="App" style={{ background: "#000" }}>
      <span className="windowHead">My Phaser 3 Game with React</span>
      <PhaserGame />
      {/* <PheserDemo /> */}
    </div>
  );
}

export default App;
