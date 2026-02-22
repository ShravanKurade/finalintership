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
let savedKey = "";

// ================= GMAIL CONFIG =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// ================= SEND OTP =================
app.post("/send-otp", async (req, res) => {
  const { email, phone, state } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  savedOTP = otp;

  const southStates = [
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana"
  ];

  try {
    // ===== SOUTH INDIA → EMAIL OTP =====
    if (southStates.includes(state)) {
      savedKey = email;

      const info = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Login OTP 🔐",
        text: `Your OTP for login is: ${otp}`
      });

      console.log("Email sent:", info.response);
      return res.json({ success: true });
    }

    // ===== OTHER STATES → SIMULATED SMS =====
    savedKey = phone;
    console.log("Phone OTP (Demo):", otp);

    return res.json({ success: true });

  } catch (error) {
    console.log("OTP ERROR:", error.message);
    return res.json({ success: false });
  }
});

// ================= VERIFY OTP =================
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  if (otp === savedOTP) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});

// ================= INVOICE EMAIL =================
app.post("/send-invoice", async (req, res) => {
  const { email, plan } = req.body;

  let price = 0;
  if (plan === "Bronze") price = 10;
  if (plan === "Silver") price = 50;
  if (plan === "Gold") price = 100;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Plan Upgrade Confirmation 🎉",
      text: `Your ${plan} plan has been activated successfully.\nAmount Paid: ₹${price}\n\nThank you for choosing us.`
    });

    console.log("Invoice sent to:", email);
    return res.json({ success: true });

  } catch (error) {
    console.log("MAIL ERROR:", error.message);
    return res.json({ success: false });
  }
});

// ================= REACT BUILD SERVE =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// IMPORTANT: index.js server folder me hai
const buildPath = path.join(__dirname, "../client/build");

app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ================= PORT =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});