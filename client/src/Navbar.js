import React from "react";

export default function Navbar({ setPage }) {
  return (
    <div style={{
      display: "flex",
      gap: "10px",
      padding: "15px",
      background: "black"
    }}>
      <button onClick={() => setPage("call")}>📹 Video Call</button>
      <button onClick={() => setPage("download")}>⬇ Download</button>
      <button onClick={() => setPage("gesture")}>🎬 Player</button>
      <button onClick={() => setPage("plan")}>💎 Upgrade</button>
      <button onClick={() => setPage("theme")}>🎨 Theme Login</button>
      <button onClick={() => setPage("comments")}>💬 Comments</button>
    </div>
  );
}