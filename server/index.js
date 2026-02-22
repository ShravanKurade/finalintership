import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let savedOTP = "";

// ===== GMAIL SETUP =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// ===== SEND OTP (EMAIL ONLY) =====
app.post("/send-otp", async (req,res)=>{
  const { email } = req.body;

  const otp = Math.floor(1000 + Math.random()*9000).toString();
  savedOTP = otp;

  try{
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your OTP",
      text: `Your Smart Login OTP is ${otp}`
    });

    console.log("OTP SENT:", otp);
    res.json({success:true});
  }catch(err){
    console.log("MAIL ERROR:",err);
    res.json({success:false});
  }
});

// ===== VERIFY OTP =====
app.post("/verify-otp",(req,res)=>{
  if(req.body.otp === savedOTP){
    res.json({success:true});
  }else{
    res.json({success:false});
  }
});

// ===== INVOICE =====
app.post("/send-invoice", async (req,res)=>{
  const { email, plan } = req.body;
  let price = plan==="Bronze"?10:plan==="Silver"?50:100;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Plan Activated",
    text: `Plan ${plan} activated successfully. Amount ₹${price}`
  });

  res.json({success:true});
});


// ===== REACT BUILD SERVE =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname,"../../client/build")));

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"../../client/build","index.html"));
});

// ===== PORT =====
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
  console.log("🚀 Server running on",PORT);
});