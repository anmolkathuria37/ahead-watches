import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first"); // ✅ Gmail IPv6 FIX
dotenv.config();

const app = express();

/* =======================
   Global Middlewares
======================= */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* =======================
   MongoDB Connection
======================= */
(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
})();

/* =======================
   Waitlist Schema
======================= */
const WaitlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      enum: ["5am", "founder", "midnight"],
    },
    preorder: {
      type: String,
      required: true,
      enum: ["yes", "maybe", "no"],
    },
  },
  { timestamps: true }
);

const Waitlist = mongoose.model("Waitlist", WaitlistSchema);

/* =======================
   Nodemailer Setup
======================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ Email server error:", err.message);
  else console.log("✅ Email server ready");
});

/* =======================
   Email Helper
======================= */
const sendConfirmation = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"AHEAD Watches" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're officially Ahead ⌚",
      html: `
        <h2>Congratulations ${name}!</h2>
        <p>You’re officially on the <b>AHEAD</b> waitlist.</p>
        <p>⌚ Be Ahead Of Time</p>
        <p>- Anmol, Founder</p>
      `,
    });

    console.log("📨 Email sent:", email);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};

/* =======================
   Waitlist API
======================= */
app.post("/api/waitlist", async (req, res) => {
  try {
    const { name, phone, email, model, preorder } = req.body;

    if (!name || !phone || !email || !model || !preorder) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Waitlist.create({ name, phone, email, model, preorder });

    sendConfirmation(email, name); // async fire & forget

    res.status(201).json({ message: "Successfully joined waitlist" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    console.error("❌ Waitlist error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   Admin Login
======================= */
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

/* =======================
   Admin Middleware
======================= */
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

/* =======================
   Admin Routes
======================= */
app.get("/api/admin/waitlist", adminAuth, async (req, res) => {
  const data = await Waitlist.find().sort({ createdAt: -1 });
  res.json(data);
});

/* =======================
   Health Check
======================= */
app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

/* =======================
   Start Server
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});