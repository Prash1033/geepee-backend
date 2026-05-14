const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DB CONNECTION =================
const db = mysql.createConnection({
  host: "localhost",
  user: "u418676780_geepee",
  password: "Geepee@8790",
  database: "u418676780_geepee"
});

db.connect(err => {
  if (err) {
    console.log("❌ DB Connection Failed", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ================= EMAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "geepeetravels65@gmail.com",
    pass: "pqzl hnez oknv scoe"
  }
});

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.send("🚀 Backend with SQL running");
});

// ================= SAVE CONTACT FORM =================
app.post("/contact", (req, res) => {

  console.log("📩 CONTACT ROUTE HIT");

  console.log(req.body);

  const { name, email, phone, message } = req.body;

  const sql = `
    INSERT INTO enquiries (name, email, phone, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, message], async (err, result) => {

    if (err) {
      console.log("❌ SQL Error:", err);
      return res.status(500).json({ success: false });
    }

    try {

      // SEND EMAIL
      await transporter.sendMail({

        from: "geepeetravels65@gmail.com",

        to: "geepeetravels65@gmail.com",

        subject: "🚀 New Enquiry - GeePee Travels",

        html: `
          <h2>New Customer Enquiry</h2>

          <p><b>Name:</b> ${name}</p>

          <p><b>Email:</b> ${email}</p>

          <p><b>Phone:</b> ${phone}</p>

          <p><b>Message:</b> ${message}</p>
        `
      });

      console.log("✅ Email Sent");

    } catch (mailError) {

      console.log("❌ Mail Error:", mailError);

    }

    res.json({ success: true });

  });

});

// ================= GET ALL ENQUIRIES =================
app.get("/enquiries", (req, res) => {

  const sql = "SELECT * FROM enquiries ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    res.json(result);

  });

});

// ================= DELETE ENQUIRY =================
app.delete("/enquiries/:id", (req, res) => {

  const id = req.params.id;

  const sql = "DELETE FROM enquiries WHERE id = ?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      console.log("❌ Delete Error:", err);
      return res.status(500).json({ success: false });
    }

    console.log("🗑 Deleted:", id);

    res.json({ success: true });

  });

});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});