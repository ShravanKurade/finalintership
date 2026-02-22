import React from "react";
import "./App.css";

import VideoMeeting from "./VideoMeeting";   // Task 1
import DownloadPage from "./DownloadPage";   // Task 2
import PlanUpgrade from "./PlanUpgrade";     // Task 3
import GesturePlayer from "./GesturePlayer"; // Task 4
import Login from "./Login";                 // Task 5
import Comments from "./Comments";           // Task 6

function App() {
  return (
    <div className="app-container">

      <h1 style={{textAlign:"center"}} className="main-title">💻 Final Internship Project</h1>

      {/* ================= TASK 1 ================= */}
      <div className="section-box">
        <h2 style={{textAlign:"center"}}>🎥 Task 1 - Video Call + Screen Share + Recording</h2>
        <VideoMeeting />
      </div>

      {/* ================= TASK 2 ================= */}
      <div className="section-box">
        <h2>⬇️ Task 2 - Video Download + Premium Payment</h2>
        <DownloadPage />
      </div>

      {/* ================= TASK 3 ================= */}
      <div className="section-box">
        <h2 style={{textAlign:"center"}}>💎 Task 3 - Plan Upgrade + Email Invoice</h2>
        <PlanUpgrade />
      </div>

      {/* ================= TASK 4 ================= */}
      <div className="section-box">
        <h2 style={{textAlign:"center"}}>🎮 Task 4 - Gesture Video Player</h2>
        <GesturePlayer />
      </div>

      {/* ================= TASK 5 ================= */}
      <div className="section-box">
        <h2 style={{textAlign:"center"}}>🌗 Task 5 - Smart Theme + OTP Login</h2>
        <Login />
      </div>

      {/* ================= TASK 6 ================= */}
      <div className="section-box">
        <h2 style={{textAlign:"center"}}>
          💬 Task 6 - Comments + Translator + Likes
        </h2>
        <Comments />
      </div>

    </div>
  );
}

export default App;