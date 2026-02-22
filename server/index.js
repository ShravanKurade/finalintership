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

// ===== GMAIL =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// ===== SEND OTP =====
app.post("/send-otp", async (req,res)=>{
  const { email, phone, state } = req.body;

  const otp = Math.floor(1000 + Math.random()*9000).toString();
  savedOTP = otp;

  const south = [
    "Tamil Nadu","Kerala","Karnataka",
    "Andhra Pradesh","Telangana"
  ];

  try{

    // ===== SOUTH → EMAIL OTP =====
    if(south.includes(state)){
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Login OTP",
        text: `Your OTP is ${otp}`
      });

      console.log("Email OTP:", otp);
      return res.json({success:true});
    }

    // ===== OTHER STATES → SIMULATED SMS =====
    console.log("Phone OTP:", otp); // terminal me dikhega
    return res.json({success:true});

  }catch(err){
    console.log(err);
    res.json({success:false});
  }
});

// ===== VERIFY =====
app.post("/verify-otp",(req,res)=>{
  res.json({success: req.body.otp === savedOTP});
});

// ===== INVOICE EMAIL =====
app.post("/send-invoice", async (req,res)=>{
  const { email, plan } = req.body;
  let price = plan==="Bronze"?10:plan==="Silver"?50:100;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Plan Activated",
    text: `Your ${plan} plan activated. Amount ₹${price}`
  });

  res.json({success:true});
});


// ===== REACT BUILD =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildPath = path.join(__dirname,"../client/build");

app.use(express.static(buildPath));
app.get("*",(req,res)=>{
  res.sendFile(path.join(buildPath,"index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log("🚀 Server running",PORT));