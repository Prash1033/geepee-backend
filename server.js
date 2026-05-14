const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DB CONNECTION =================
const db = new Pool({
  connectionString: "postgresql://neondb_owner:npg_7JUFBAXrmI9q@ep-empty-sea-aopo50g5.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=req",
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect()
  .then(() => console.log("✅ Neon PostgreSQL Connected"))
  .catch(err => console.log("❌ DB Error:", err));
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

 const sql = `
  INSERT INTO enquiries (name, email, phone, message)
  VALUES ($1, $2, $3, $4)
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

  const sql = "DELETE FROM enquiries WHERE id = $1";

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
