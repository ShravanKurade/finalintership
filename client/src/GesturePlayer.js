import React, { useRef, useState } from "react";

export default function GesturePlayer() {
  const videoRef = useRef(null);

  const [videoIndex, setVideoIndex] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [paused, setPaused] = useState(false);

  const videos = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4"
  ];

  let clickCount = 0;
  let clickTimer = null;

  const handleTap = (side) => {
    clickCount++;
    clearTimeout(clickTimer);

    clickTimer = setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;

      // single center
      if (clickCount === 1 && side === "center") {
        if (video.paused) {
          video.play();
          setPaused(false);
        } else {
          video.pause();
          setPaused(true);
        }
      }

      // double tap
      if (clickCount === 2) {
        if (side === "right") video.currentTime += 10;
        if (side === "left") video.currentTime -= 10;
      }

      // triple tap
      if (clickCount === 3) {
        if (side === "center") {
          setVideoIndex((prev) => (prev + 1) % videos.length);
        }
        if (side === "left") {
          setShowComment(true);
        }
        if (side === "right") {
          window.location.href = "about:blank";
        }
      }

      clickCount = 0;
    }, 300);
  };

  // manual play/pause button
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  // download video
  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = videos[videoIndex];
    link.download = "video.mp4";
    link.click();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2 style={{color:"cyan"}}>🎬 Smart Gesture Video Player</h2>

      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          src={videos[videoIndex]}
          width="720"
          style={{
            borderRadius: "20px",
            border: "4px solid cyan",
            boxShadow: "0 0 30px cyan"
          }}
        />

        {/* LEFT */}
        <div onClick={() => handleTap("left")}
          style={{ position:"absolute",left:0,top:0,width:"33%",height:"100%"}} />

        {/* CENTER */}
        <div onClick={() => handleTap("center")}
          style={{ position:"absolute",left:"33%",top:0,width:"34%",height:"100%"}} />

        {/* RIGHT */}
        <div onClick={() => handleTap("right")}
          style={{ position:"absolute",right:0,top:0,width:"33%",height:"100%"}} />
      </div>

      {/* CONTROLS */}
      <div style={{marginTop:"15px"}}>
        <button onClick={togglePlay} style={btn}>
          {paused ? "▶ Play" : "⏸ Pause"}
        </button>

        <button onClick={downloadVideo} style={btn}>
          ⬇ Download
        </button>
      </div>

      {showComment && (
        <h3 style={{color:"cyan",marginTop:"15px"}}>
          💬 Comment Section Opened
        </h3>
      )}
    </div>
  );
}

const btn={
  margin:"10px",
  padding:"12px 22px",
  borderRadius:"10px",
  border:"none",
  background:"cyan",
  fontWeight:"bold",
  cursor:"pointer"
};