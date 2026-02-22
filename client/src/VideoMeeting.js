import React, { useRef, useState } from "react";

export default function VideoMeeting() {
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  let chunks = [];

  const startScreenShare = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    videoRef.current.srcObject = stream;
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    recorderRef.current = new MediaRecorder(stream);

    recorderRef.current.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Recording.webm";
      a.click();
    };

    recorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current.stop();
    setRecording(false);
    alert("Recording Saved");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Video Call + Screen Share + Recording</h1>

      <video ref={videoRef} autoPlay width="700" controls />

      <br /><br />

      <button onClick={startScreenShare}>Start Screen Share</button>

      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </div>
  );
}