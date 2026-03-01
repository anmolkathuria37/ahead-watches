import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Twilio from "twilio";
import crypto from "crypto";
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
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
})();

/* =======================
   Schemas
======================= */
const WaitlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true, trim: true },
    model: { type: String, required: true, enum: ["5am", "founder", "midnight"] },
    preorder: { type: String, required: true, enum: ["yes", "maybe", "no"] },
    status: { type: String, default: "pending", enum: ["pending", "fulfilled"] },
    password: { type: String },
  },
  { timestamps: true }
);

const GrievanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Waitlist", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    subject: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const Waitlist = mongoose.model("Waitlist", WaitlistSchema);
const Grievance = mongoose.model("Grievance", GrievanceSchema);

/* =======================
   Nodemailer Setup
======================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("❌ Email server error:", error.message);
  else console.log("✅ Email server ready");
});

/* =======================
   Twilio Setup
======================= */
const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/* =======================
   Email Helpers
======================= */
const sendConfirmation = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"AHEAD Watches" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Congratulations, You're Officially Ahead ⌚",
      html: `
        <div style="font-family:Arial,sans-serif; padding:24px; background:#0a0a12; color:#e0e0e8;">
          <div style="max-width:600px; margin:auto; background:linear-gradient(135deg, #12121a, #1a1a25); padding:40px; border-radius:12px; border:1px solid #2a2a35;">
            <div style="text-align:center; margin-bottom:30px;">
              <h1 style="color:#e0e0e8; font-size:32px; margin:0; letter-spacing:4px;">AHEAD</h1>
              <p style="color:#6a6a7a; font-size:12px; letter-spacing:6px; text-transform:uppercase;">Watches</p>
            </div>
            <h2 style="color:#c0c0cc; font-size:24px; margin-bottom:15px;">Congratulations, ${name}!</h2>
            <p style="font-size:16px; line-height:1.8; color:#a0a0b0;">
              You've officially secured your spot on the <strong style="color:#e0e0e8;">AHEAD</strong> waitlist!
              Welcome to an exclusive community of visionaries who value time, style, and innovation.
            </p>
            <p style="font-size:16px; line-height:1.8; color:#a0a0b0;">
              As the founder, I personally curated this experience for forward-thinkers like you.
              This is <strong style="color:#e0e0e8;">the choice of a founder</strong>.
            </p>
            <div style="margin:30px 0; padding:20px; background:#0f0f18; border-radius:8px; border:1px solid #2a2a35;">
              <p style="color:#6a6a7a; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0 0 8px;">Your Login Credentials</p>
              <p style="color:#e0e0e8; font-size:14px; margin:0;">Check your email for password details to access your dashboard.</p>
            </div>
            <div style="text-align:center; margin-top:30px;">
              <a href="https://www.instagram.com/theanmolkathuria" style="color:#8090b0; text-decoration:none; font-size:13px;">@theanmolkathuria</a>
            </div>
            <p style="text-align:center; color:#4a4a5a; font-size:11px; margin-top:20px; letter-spacing:2px;">
              ⌚ Be Ahead Of Time — Anmol, Founder
            </p>
          </div>
        </div>
      `,
    });
    console.log("📨 Confirmation email sent:", email);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};

const sendPasswordEmail = async (email, name, password) => {
  try {
    await transporter.sendMail({
      from: `"AHEAD Watches" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your AHEAD Dashboard Access ⌚",
      html: `
        <div style="font-family:Arial,sans-serif; padding:24px; background:#0a0a12; color:#e0e0e8;">
          <div style="max-width:600px; margin:auto; background:linear-gradient(135deg, #12121a, #1a1a25); padding:40px; border-radius:12px; border:1px solid #2a2a35;">
            <h2 style="color:#c0c0cc; font-size:22px; margin-bottom:15px;">Welcome to AHEAD, ${name}</h2>
            <p style="color:#a0a0b0; font-size:15px; line-height:1.8;">Your dashboard login credentials:</p>
            <div style="margin:20px 0; padding:20px; background:#0f0f18; border-radius:8px; border:1px solid #2a2a35;">
              <p style="color:#6a6a7a; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0 0 5px;">Email</p>
              <p style="color:#e0e0e8; font-size:15px; margin:0 0 15px;">${email}</p>
              <p style="color:#6a6a7a; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0 0 5px;">Password</p>
              <p style="color:#e0e0e8; font-size:15px; margin:0; font-family:monospace; letter-spacing:1px;">${password}</p>
            </div>
            <p style="color:#6a6a7a; font-size:12px;">Keep this safe. You can use it to track your waitlist status.</p>
          </div>
        </div>
      `,
    });
    console.log("📨 Password email sent:", email);
  } catch (err) {
    console.error("❌ Password email failed:", err.message);
  }
};

const sendGrievanceNotification = async (userName, userEmail, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"AHEAD System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[Grievance] ${subject} — from ${userName}`,
      html: `
        <div style="font-family:Arial,sans-serif; padding:20px;">
          <h2>New Grievance from ${userName}</h2>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left:3px solid #ccc; padding-left:15px; color:#555;">${message}</blockquote>
        </div>
      `,
    });
  } catch (err) {
    console.error("❌ Grievance notification failed:", err.message);
  }
};

const sendWhatsAppConfirmation = async ({ phone, name }) => {
  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phone}`,
      body: `Hi ${name}, you're officially on the AHEAD Watches waitlist! ⌚ — The choice of a founder. Follow: @theanmolkathuria`,
    });
    console.log("💬 WhatsApp sent to:", phone);
  } catch (err) {
    console.error("❌ WhatsApp failed:", err.message);
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

    // Auto-generate password for user login
    const password = crypto.randomBytes(4).toString("hex"); // 8 char random

    await Waitlist.create({ name, phone, email, model, preorder, password });

    // Send confirmations
    sendConfirmation(email, name);
    sendPasswordEmail(email, name, password);
    sendWhatsAppConfirmation({ phone, name });

    return res.status(201).json({ message: "Successfully joined waitlist" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Email already exists" });

    console.error("❌ Waitlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   User Auth
======================= */
app.post("/api/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    const user = await Waitlist.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Email not found on waitlist" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  } catch (err) {
    console.error("❌ User login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   User Middleware
======================= */
const userAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

/* =======================
   User Routes
======================= */
app.get("/api/user/me", userAuth, async (req, res) => {
  try {
    const user = await Waitlist.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Calculate position
    const position = await Waitlist.countDocuments({ createdAt: { $lte: user.createdAt } });

    return res.json({ ...user.toObject(), position });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/user/grievance", userAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ message: "All fields required" });

    const user = await Waitlist.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Grievance.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      subject,
      message,
    });

    // Notify admin
    sendGrievanceNotification(user.name, user.email, subject, message);

    return res.json({ message: "Grievance submitted" });
  } catch (err) {
    console.error("❌ Grievance error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   Admin Auth
======================= */
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Not admin" });
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

/* =======================
   Admin Routes
======================= */


// Grevience Portal updates and delete options for admin
/* =======================
   Update Grievance (Admin)
======================= */
app.put("/api/admin/grievances/:id", adminAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message required" });
    }

    const updated = await Grievance.findByIdAndUpdate(
      req.params.id,
      { subject, message },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.json({ message: "Grievance updated", grievance: updated });
  } catch (err) {
    console.error("❌ Update grievance error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* =======================
   Delete Grievance (Admin)
======================= */
app.delete("/api/admin/grievances/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await Grievance.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.json({ message: "Grievance deleted" });
  } catch (err) {
    console.error("❌ Delete grievance error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});
// ----------------------------------------------------------------------
app.get("/api/admin/waitlist", adminAuth, async (req, res) => {
  const data = await Waitlist.find().select("-password").sort({ createdAt: -1 });
  res.json(data);
});

app.put("/api/admin/waitlist/:id", adminAuth, async (req, res) => {
  try {
    const { name, phone, model, preorder, status } = req.body;
    await Waitlist.findByIdAndUpdate(req.params.id, { name, phone, model, preorder, status });
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

app.delete("/api/admin/waitlist/:id", adminAuth, async (req, res) => {
  try {
    await Waitlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

app.get("/api/admin/grievances", adminAuth, async (req, res) => {
  const data = await Grievance.find().sort({ createdAt: -1 });
  res.json(data);
});

/* =======================
   Health Check
======================= */
app.get("/health", (_, res) => res.json({ status: "OK" }));

/* =======================
   Server Start
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
