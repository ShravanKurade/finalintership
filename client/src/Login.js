import React, { useState, useEffect } from "react";
import axios from "axios";

// ⭐ OUTSIDE component (important for Netlify build)
const southStates = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana"
];

export default function Login() {

  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [otp,setOtp]=useState("");
  const [verified,setVerified]=useState(false);
  const [state,setState]=useState("");
  const [key,setKey]=useState("");
  const [theme,setTheme]=useState("dark");

  // ===== THEME LOGIC =====
  useEffect(()=>{
    if(!state) return;

    const now = new Date();
    const hours = now.getHours();

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

    // If NOT south state → phone compulsory
    if(!southStates.includes(state)){
      if(!/^\d{10}$/.test(phone)){
        alert("Enter valid 10 digit phone number");
        return;
      }
    }

    try{
      const res = await axios.post("https://loginsphere-vrov.onrender.com/send-otp",{
        email,
        phone,
        state
      });

      if(res.data.success){
        alert("OTP sent successfully");
        setKey(southStates.includes(state)?email:phone);
      }else{
        alert("Failed to send OTP");
      }

    }catch{
      alert("Server error");
    }
  };

  // ===== VERIFY OTP =====
  const verify = async () => {

    try{
      const res = await axios.post("https://loginsphere-vrov.onrender.com/send-otp",{
        key,
        otp
      });

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
        padding:"30px 25px",
        borderRadius:"18px",
        boxShadow:"0 0 25px rgba(0,255,255,0.35)"
      }}>

        <h2 style={{textAlign:"center",marginBottom:"20px"}}>
          🔐 Smart Login
        </h2>

        {/* STATE */}
        <select
          value={state}
          onChange={(e)=>setState(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Your State</option>
          <option>Maharashtra</option>
          <option>Tamil Nadu</option>
          <option>Kerala</option>
          <option>Karnataka</option>
          <option>Andhra Pradesh</option>
          <option>Telangana</option>
          <option>Gujarat</option>
          <option>Delhi</option>
        </select>

        {/* EMAIL */}
        <input
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* PHONE */}
        <input
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          style={inputStyle}
        />

        <button onClick={sendOTP} style={btnStyle}>
          Send OTP
        </button>

        {/* OTP */}
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e)=>setOtp(e.target.value)}
          style={inputStyle}
        />

        <button onClick={verify} style={btnStyle}>
          Verify
        </button>

        {verified && (
          <h3 style={{color:"#22c55e",textAlign:"center"}}>
            ✅ User Verified Successfully
          </h3>
        )}

      </div>
    </div>
  );
}

// ===== STYLES =====
const inputStyle={
  width:"100%",
  padding:"14px",
  marginBottom:"15px",
  borderRadius:"10px",
  border:"1px solid #334155",
  outline:"none",
  fontSize:"15px",
  boxSizing:"border-box"
};

const btnStyle={
  width:"100%",
  padding:"13px",
  background:"#06b6d4",
  color:"white",
  border:"none",
  borderRadius:"10px",
  fontSize:"15px",
  marginBottom:"15px",
  cursor:"pointer"
};