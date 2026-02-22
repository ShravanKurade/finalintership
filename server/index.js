import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

let savedOTP = "";

// ===== GMAIL =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sunitakurade1505@gmail.com",
    pass: "ooiqfsycskzltrfo"
  }
});

// ===== SEND OTP =====
app.post("/send-otp", async (req,res)=>{
  const { email, state } = req.body;

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

    // ===== SOUTH INDIA → EMAIL =====
    if(south.includes(state)){

      await transporter.sendMail({
        from:"sunitakurade1505@gmail.com",
        to:email,
        subject:"Login OTP 🔐",
        text:`Your OTP is ${otp}`
      });

      console.log("MAIL SENT:",otp);

      return res.json({
        success:true,
        msg:"OTP sent to Email",
        otp:otp
      });
    }

    // ===== OTHER STATES → DEMO OTP =====
    return res.json({
      success:true,
      msg:"OTP generated",
      otp:otp
    });

  }catch(err){
    console.log("MAIL ERROR:",err);

    // ⚠️ NO SERVER ERROR RETURN
    return res.json({
      success:true,
      msg:"OTP generated (mail issue but demo ok)",
      otp:otp
    });
  }
});

// ===== VERIFY =====
app.post("/verify-otp",(req,res)=>{
  const { otp } = req.body;

  if(otp===savedOTP){
    res.json({success:true});
  }else{
    res.json({success:false});
  }
});

// ===== START =====
app.listen(5000,()=>{
  console.log("🔥 Server running 5000");
});