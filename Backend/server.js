import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Twilio from "twilio";
dotenv.config();

const app = express();

/* =======================
   Global Middlewares
======================= */
app.use(
  cors({
    origin: "*", // later frontend domain restrict kar sakta hai
  })
);
app.use(express.json());

/* =======================
   MongoDB Connection
======================= */
(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
})();

/* =======================
   Waitlist Schema
======================= */
const WaitlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },


    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
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
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Gmail App Password
//   },
// });
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // IMPORTANT: false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false, // helps in cloud envs
  },
});

// Verify mailer
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email server error:", error.message);
  } else {
    console.log("✅ Email server ready");
  }
});

/* =======================
   Twilio Setup
======================= */
const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);



/* =======================
   Email Helper
======================= */

const sendConfirmation = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"AHEAD Watches" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Congratulations, You're Officially Ahead ⌚",
      html: `
        <div style="font-family:Arial,sans-serif; padding:24px; background:#f7f7f7; color:#111;">
          <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
            <h1 style="color:#111; font-size:28px; margin-bottom:10px;">Congratulations, ${name}!</h1>
            <p style="font-size:16px; line-height:1.6; color:#333;">
              You’ve officially secured your spot on the <strong>AHEAD</strong> waitlist! 
              Welcome to an exclusive community of visionaries who value time, style, and innovation.
            </p>
            <p style="font-size:16px; line-height:1.6; color:#333;">
              As the founder of <strong>AHEAD Watches</strong>, I personally selected our designs and curated this experience for forward-thinkers like you. 
              This is <strong>the choice of a founder</strong> — a suggestion I make for those who want to always be ahead.
            </p>
            <p style="font-size:16px; line-height:1.6; color:#333; margin-top:20px;">
              Stay connected and get inspired daily: 
              <a href="https://www.instagram.com/theanmolkathuria" target="_blank" style="color:#0077ff; text-decoration:none;">@theanmolkathuria</a>
            </p>
            <h2 style="font-size:18px; font-weight:bold; color:#111; margin-top:30px;">
              ⌚ Be Ahead Of Time — Anmol, Founder
            </h2>
            <div style="margin-top:20px; text-align:center;">
              <b> AHEAD Watches </b>
            </div>
          </div>
        </div>
      `,
    });

    console.log("📨 Confirmation email sent:", email);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};


// /* =======================
//    Helper: Send WhatsApp
// ======================= */
// const sendWhatsAppConfirmation = async ({phone, name}) => {
//   try {
//     await twilioClient.messages.create({
//       from: process.env.TWILIO_WHATSAPP_NUMBER,
//       to: `whatsapp:${phone}`, // e.g., +91XXXXXXXXXX
//       body: `Hi ${name}, you’re officially on the AHEAD Watches waitlist! ⌚ — The choice of a founder. Follow: @theanmolkathuria`,
//     });
//     console.log("💬 WhatsApp sent to:", phone);
//   } catch (err) {
//     console.error("❌ WhatsApp failed:", err.message);
//   }
// };

/* =======================
   Waitlist API
======================= */
// app.post("/api/waitlist", async (req, res) => {
//   try {
//     const { name, email, model, preorder } = req.body;

//     if (!name || !email || !model || !preorder) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     await Waitlist.create({ name, email, model, preorder });

//     // Send email AFTER successful DB save
//     sendConfirmation(email, name);

//     return res.status(201).json({
//       message: "Successfully joined waitlist",
//     });
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(409).json({
//         message: "Email already exists",
//       });
//     }

//     console.error("❌ Waitlist error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post("/api/waitlist", async (req, res) => {
//   try {
//     const { name, phone, email, model, preorder } = req.body;

//     if (!name || !email || !model || !preorder) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Save to DB
//     await Waitlist.create({ name, email, model, preorder });

//     // Send both Email + WhatsApp
//     sendEmailConfirmation(email, name);
//     if (phone) sendWhatsAppConfirmation(phone, name); // optional if phone provided

//     return res.status(201).json({ message: "Successfully joined waitlist" });
//   } catch (err) {
//     if (err.code === 11000)
//       return res.status(409).json({ message: "Email already exists" });

//     console.error("❌ Waitlist error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

app.post("/api/waitlist", async (req, res) => {
  try {
    const { name, phone, email, model, preorder } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !model || !preorder) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to DB including phone
    await Waitlist.create({ name, phone, email, model, preorder });

    // Send Email + WhatsApp
    sendConfirmation(email, name); // correct email helper
    // sendWhatsAppConfirmation({ phone, name }); // object syntax

    return res.status(201).json({ message: "Successfully joined waitlist" });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Email already exists" });

    console.error("❌ Waitlist error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =======================
   Admin Auth
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
// const adminAuth = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // optional, future-proof
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
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
   Server Start
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
