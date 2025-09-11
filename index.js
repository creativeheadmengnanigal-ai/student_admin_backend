const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ API to update email & password
app.post("/updateStudentAuth", async (req, res) => {
  try {
    const { uid, email, password } = req.body;

    if (!uid || !email || !password) {
      return res.status(400).json({ error: "Missing uid, email, or password" });
    }

    await admin.auth().updateUser(uid, {
      email: email,
      password: password,
    });

    res.json({ success: true, message: "Auth updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
