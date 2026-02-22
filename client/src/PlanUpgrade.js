import React, { useState, useEffect, useRef } from "react";

export default function PlanUpgrade() {
  const [plan, setPlan] = useState("Free");
  const [email, setEmail] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem("plan");
    if (savedPlan) setPlan(savedPlan);
  }, []);

  // 🎬 WATCH LIMIT
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    let limit = 0;

    if (plan === "Free") limit = 5 * 60;
    if (plan === "Bronze") limit = 7 * 60;
    if (plan === "Silver") limit = 10 * 60;
    if (plan === "Gold") limit = 999999;

    if (video.currentTime >= limit) {
      video.pause();
      alert(`⛔ ${plan} plan limit finished. Upgrade for more watching.`);
    }
  };

  // 💳 PAYMENT
  const upgradePlan = (selectedPlan, price) => {

    if (!email) {
      alert("⚠ Enter your email first");
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: price * 100,
      currency: "INR",
      name: "Plan Upgrade",
      description: selectedPlan + " Plan",
      handler: async function () {

        localStorage.setItem("plan", selectedPlan);
        setPlan(selectedPlan);

        // 🔥 SEND EMAIL
        try {
          await fetch("http://localhost:5000/send-invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              plan: selectedPlan,
              amount: price
            })
          });
        } catch (err) {
          console.log("Email error:", err);
        }

        alert("🎉 Payment Successful! Invoice sent to email");
      },
      theme: { color: "#00f2fe" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Current Plan: {plan}</h2>

      {/* EMAIL INPUT */}
      <input
        type="email"
        placeholder="Enter your email for invoice"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginBottom: "15px",
          borderRadius: "8px"
        }}
      />

      <br/>

      {plan === "Free" && (
        <div>
          <button onClick={() => upgradePlan("Bronze", 10)}>Bronze ₹10</button>
          <button onClick={() => upgradePlan("Silver", 50)}>Silver ₹50</button>
          <button onClick={() => upgradePlan("Gold", 100)}>Gold ₹100</button>
        </div>
      )}

      {plan !== "Free" && (
        <h3 style={{color:"cyan"}}>👑 {plan} Plan Activated</h3>
      )}

      <br/>

      <video
        ref={videoRef}
        width="600"
        controls
        onTimeUpdate={handleTimeUpdate}
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"/>
      </video>
    </div>
  );
}