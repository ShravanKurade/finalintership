import React, { useState } from "react";
import axios from "axios";

export default function Login(){

const [email,setEmail]=useState("");
const [otp,setOtp]=useState("");
const [state,setState]=useState("");
const [verified,setVerified]=useState(false);

const sendOTP = async ()=>{

  if(!state){
    alert("Select state first");
    return;
  }

  try{
    const res = await axios.post("http://localhost:5000/send-otp",{
      email,
      state
    });

    if(res.data.success){

      alert("OTP Sent Successfully ✅");

      if(res.data.msg.includes("Email")){
        alert("Mail sent successfully 📧");
      }

      alert("Your OTP is: "+res.data.otp);   // 👈 OTP popup

    }else{
      alert("Failed");
    }

  }catch{
    alert("Server error");
  }
};

const verify = async ()=>{
  const res = await axios.post("http://localhost:5000/verify-otp",{otp});

  if(res.data.success){
    setVerified(true);
  }else{
    alert("Wrong OTP");
  }
};

return(
<div style={{textAlign:"center",marginTop:"40px"}}>

<h2>🔐 Smart Login</h2>

<select value={state} onChange={e=>setState(e.target.value)}>
<option value="">Select State</option>
<option>Maharashtra</option>
<option>Tamil Nadu</option>
<option>Kerala</option>
<option>Karnataka</option>
<option>Andhra Pradesh</option>
<option>Telangana</option>
</select>

<br/><br/>

<input placeholder="Enter Email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<br/><br/>

<button onClick={sendOTP}>Send OTP</button>

<br/><br/>

<input placeholder="Enter OTP"
value={otp}
onChange={e=>setOtp(e.target.value)}
/>

<br/><br/>

<button onClick={verify}>Verify</button>

{verified && <h3 style={{color:"green"}}>User Verified ✅</h3>}

</div>
);
}