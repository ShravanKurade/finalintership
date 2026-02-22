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
    // South → Email + return OTP
    if (southStates.includes(state)) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Login OTP 🔐",
        text: `Your OTP is ${otp}`
      });

      return res.json({ success: true, otp });
    }

    // Other states → Just return OTP
    return res.json({ success: true, otp });

  } catch (error) {
    console.log("OTP ERROR:", error.message);
    return res.json({ success: false });
  }
});

// ================= VERIFY =================
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  res.json({ success: otp === savedOTP });
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
      text: `Your ${plan} plan has been activated successfully.
Amount Paid: ₹${price}

Thank you for choosing us.`
    });

    return res.json({ success: true });

  } catch (error) {
    console.log("MAIL ERROR:", error.message);
    return res.json({ success: false });
  }
});

// ================= SERVE REACT =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const buildPath = path.join(__dirname, "../client/build");

app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});