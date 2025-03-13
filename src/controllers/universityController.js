const db = require("../config/db");

// Get all universities
exports.getUniversities = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM university");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching universities", error });
  }
};

// Upload university image
exports.uploadUniversityImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const { uni_name, uni_Address, uni_contactnumber } = req.body;

    const query = "INSERT INTO university (uni_name, uni_Address, uni_contactnumber, uni_image) VALUES (?, ?, ?, ?)";
    await db.query(query, [uni_name, uni_Address, uni_contactnumber, imageUrl]);

    res.status(201).json({ message: "University added successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading university", error });
  }
};

// create university

exports.createUniversity = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`; // Path to the uploaded image
    const { uni_name, uni_Address, uni_contact_number } = req.body;

    if (!uni_name || !uni_Address || !uni_contact_number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const query = "INSERT INTO university (uni_name, uni_Address, uni_contact_number, uni_image) VALUES (?, ?, ?, ?)";
    await db.query(query, [uni_name, uni_Address, uni_contact_number, imageUrl]);

    res.status(201).json({ message: "University added successfully", imageUrl });
  } catch (error) {
    console.error("Error creating university:", error);
    res.status(500).json({ message: "Error creating university", error });
  }
};



