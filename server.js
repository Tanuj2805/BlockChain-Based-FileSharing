// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { uploadFileStream, uploadJSON } from "./pinataClient.js";

dotenv.config({ quiet: true }); // loads .env safely

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Get directory info (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Set up multer for file uploads (stores temporarily in /uploads)
const upload = multer({ dest: "uploads/" });

// 🧩 ROUTE 1: Root test page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("📂 Received file:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const cid = await uploadFileStream(
      req.file.path,
      req.file.originalname,
      req.file.mimetype
    );

    await fs.promises.unlink(req.file.path).catch(() => {});
    res.json({ cid });
  } catch (err) {
    console.error("❌ Upload-file error:", err);
    res.status(500).json({ error: err.message || "upload failed" });
  }
});


// 🧩 ROUTE 3: Upload JSON (e.g., encrypted AES key)
app.post("/upload-json", async (req, res) => {
  try {
    const json = req.body;
    if (!json) return res.status(400).json({ error: "Missing JSON body" });

    const cid = await uploadJSON(json);
    console.log("✅ JSON uploaded to IPFS:", cid);
    res.json({ cid });
  } catch (err) {
    console.error("❌ Upload-json error:", err);
    res.status(500).json({ error: err.message || "Upload-json failed" });
  }
});

// 🧩 START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Pinata server running at http://localhost:${PORT}`);
});