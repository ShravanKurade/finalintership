import React, { useState, useEffect } from "react";

export default function DownloadPage() {

  const [downloads, setDownloads] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  useEffect(() => {
    const plan = localStorage.getItem("plan");
    if (plan && plan !== "Free") setIsPremium(true);

    const storedDownloads = JSON.parse(localStorage.getItem("downloads")) || [];
    const count = parseInt(localStorage.getItem("downloadCount")) || 0;

    setDownloads(storedDownloads);
    setDownloadCount(count);
  }, []);

  // 🎬 Download Logic
  const handleDownload = () => {

    if (!isPremium && downloadCount >= 1) {
      alert("❌ Free users can download only 1 video per day. Upgrade to Premium!");
      return;
    }

    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = "SampleVideo.mp4";
    link.click();

    const newDownloads = [...downloads, "SampleVideo.mp4"];
    setDownloads(newDownloads);
    localStorage.setItem("downloads", JSON.stringify(newDownloads));

    if (!isPremium) {
      const newCount = downloadCount + 1;
      setDownloadCount(newCount);
      localStorage.setItem("downloadCount", newCount);
    }

    alert("✅ Download Started!");
  };

  return (
    <div style={{ textAlign: "center" }}>

      <h2>🎬 Video Download Section</h2>

      {isPremium && (
        <h3 style={{ color: "cyan" }}>👑 Premium User</h3>
      )}

      {/* VIDEO PLAYER */}
      <video width="600" controls style={{ marginBottom: "15px" }}>
        <source src={videoUrl} type="video/mp4" />
      </video>

      <br />

      {/* DOWNLOAD BUTTON */}
      <button onClick={handleDownload}>
        ⬇ Download Video
      </button>

      <h4>Your Downloads:</h4>

      {downloads.length === 0 ? (
        <p>No downloads yet</p>
      ) : (
        <ul>
          {downloads.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

    </div>
  );
}