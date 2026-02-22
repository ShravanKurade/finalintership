import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== dirname fix =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ===== PATH FIX (VERY IMPORTANT) =====
const buildPath = path.join(__dirname, "../client/build");

app.use(express.static(buildPath));

app.get("*",(req,res)=>{
  res.sendFile(path.join(buildPath,"index.html"));
});

// ===== PORT =====
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log("🚀 Server running on",PORT);
});