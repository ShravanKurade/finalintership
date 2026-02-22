import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Login() {

  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [otp,setOtp]=useState("");
  const [verified,setVerified]=useState(false);
  const [state,setState]=useState("");
  const [theme,setTheme]=useState("dark");
  const [demoOtp,setDemoOtp]=useState("");

  const southStates=[
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana"
  ];

  // ===== THEME =====
  useEffect(()=>{
    if(!state) return;

    const hours = new Date().getHours();

    if(hours>=10 && hours<12 && southStates.includes(state)){
      setTheme("light");
    }else{
      setTheme("dark");
    }
  },[state]);

  // ===== SEND OTP =====
  const sendOTP = async () => {

    if(!state){
      alert("Select state first");
      return;
    }

    try{
      const res = await axios.post("/send-otp",{
        email,
        phone,
        state
      });

      if(res.data.success){
        setDemoOtp(res.data.otp); // 👈 Show OTP on screen
      }else{
        alert("Failed to send OTP");
      }

    }catch{
      alert("Server error");
    }
  };

  // ===== VERIFY =====
  const verify = async () => {
    try{
      const res = await axios.post("/verify-otp",{ otp });

      if(res.data.success){
        setVerified(true);
      }else{
        alert("Wrong OTP");
      }

    }catch{
      alert("Verification error");
    }
  };

  return (
    <div style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      padding:"40px 15px"
    }}>

      <div style={{
        width:"100%",
        maxWidth:"420px",
        background: theme==="light" ? "#ffffff" : "#0f172a",
        color: theme==="light" ? "#000000" : "#ffffff",
        padding:"30px",
        borderRadius:"18px",
        boxShadow:"0 0 25px rgba(0,255,255,0.35)"
      }}>

        <h2 style={{textAlign:"center"}}>🔐 Smart Login</h2>

        <select value={state} onChange={(e)=>setState(e.target.value)} style={inputStyle}>
          <option value="">Select State</option>
          <option>Maharashtra</option>
          <option>Tamil Nadu</option>
          <option>Kerala</option>
          <option>Karnataka</option>
          <option>Andhra Pradesh</option>
          <option>Telangana</option>
          <option>Delhi</option>
        </select>

        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} style={inputStyle}/>
        <input placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} style={inputStyle}/>

        <button onClick={sendOTP} style={btnStyle}>Send OTP</button>

        {demoOtp && (
          <p style={{textAlign:"center",color:"#06b6d4"}}>
            Demo OTP: {demoOtp}
          </p>
        )}

        <input placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} style={inputStyle}/>
        <button onClick={verify} style={btnStyle}>Verify</button>

        {verified && (
          <h3 style={{color:"#22c55e",textAlign:"center"}}>
            ✅ User Verified Successfully
          </h3>
        )}

      </div>
    </div>
  );
}

const inputStyle={
  width:"100%",
  padding:"12px",
  marginBottom:"12px",
  borderRadius:"8px",
  border:"1px solid #334155",
  outline:"none"
};

const btnStyle={
  width:"100%",
  padding:"12px",
  background:"#06b6d4",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer",
  marginBottom:"12px"
};