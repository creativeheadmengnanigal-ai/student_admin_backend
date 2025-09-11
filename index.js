 // index.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";

// ✅ Load Firebase Admin SDK
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Root endpoint (so you don't see "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🚀 Student Admin Backend is running!");
});

// ✅ Auth update endpoint
app.post("/updateStudentAuth", async (req, res) => {
  try {
    const { uid, email, password } = req.body;

    if (!uid || !email || !password) {
      return res.status(400).json({ error: "Missing uid, email, or password" });
    }

    // 🔑 Update Firebase Authentication user
    await admin.auth().updateUser(uid, {
      email,
      password,
    });

    return res.json({ success: true, message: "Auth updated ✅" });

  } catch (error) {
    console.error("Auth update error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
