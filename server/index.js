import express from "express";
import cors from "cors";
import twilio from "twilio";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let savedOTP = "";

// ===== TWILIO CONFIG =====
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const twilioNumber = process.env.TWILIO_NUMBER;

const client = twilio(accountSid, authToken);

// ===== GMAIL CONFIG =====
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
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana"
  ];

  try{

    // SOUTH INDIA → EMAIL OTP
    if(south.includes(state)){
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Your OTP",
        text: `Your login OTP is ${otp}`
      });

      return res.json({success:true});
    }

    // OTHER STATES → PHONE OTP
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioNumber,
      to: `+91${phone}`
    });

    res.json({success:true});

  }catch(err){
    console.log(err);
    res.json({success:false});
  }
});

// ===== VERIFY OTP =====
app.post("/verify-otp",(req,res)=>{
  const { otp } = req.body;

  if(otp===savedOTP){
    res.json({success:true});
  }else{
    res.json({success:false});
  }
});

// ===== INVOICE EMAIL =====
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


// ===== FRONTEND SERVE (VERY IMPORTANT) =====
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"client/build","index.html"));
});


// ===== PORT =====
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log("🚀 Server running on", PORT);
});