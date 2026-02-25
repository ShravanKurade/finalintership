import React, { useState, useEffect } from "react";

export default function DownloadPage() {

  const [downloads, setDownloads] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    const premiumStatus = localStorage.getItem("premium");
    const storedDownloads = JSON.parse(localStorage.getItem("downloads")) || [];
    const count = parseInt(localStorage.getItem("downloadCount")) || 0;

    setIsPremium(premiumStatus === "true");
    setDownloads(storedDownloads);
    setDownloadCount(count);
  }, []);

  // 🎬 DOWNLOAD
  const handleDownload = () => {

    if (!isPremium && downloadCount >= 1) {
      alert("❌ Free users can download only 1 video per day. Upgrade to Premium!");
      return;
    }

    const videoName = "SampleVideo.mp4";

    const newDownloads = [...downloads, videoName];
    setDownloads(newDownloads);

    localStorage.setItem("downloads", JSON.stringify(newDownloads));

    if (!isPremium) {
      const newCount = downloadCount + 1;
      setDownloadCount(newCount);
      localStorage.setItem("downloadCount", newCount);
    }

    alert("✅ Download Started!");
  };

  // 💎 DEMO PAYMENT (real jaisa popup)
  const upgradePremium = () => {

    const fake = window.confirm(
      "Razorpay Secure Payment\n\nAmount: ₹500\nProceed to pay?"
    );

    if(fake){
      setTimeout(()=>{
        localStorage.setItem("premium","true");
        setIsPremium(true);

        alert("🎉 Payment Successful!\nPremium Activated.");
      },1500);
    }
  };

  return (
    <div style={{textAlign:"center"}}>

      {isPremium && (
        <h3 style={{color:"cyan"}}>👑 Premium User Activated</h3>
      )}

      <button onClick={handleDownload}>
        Download Video
      </button>

      {!isPremium && (
        <button onClick={upgradePremium}>
          Upgrade to Premium ₹500
        </button>
      )}

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