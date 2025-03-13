const db = require("../config/db");
// Get boardings details
exports.getBoardingDetail = async (req,res) => {
  try {
      const [rows] = await db.query("SELECT * FROM boarding");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching boardings", error });
    }
}

// Get all boarding details by uni id
exports.getBoardingDetailsByUniId = async (req, res) => {
    try {
      const { uni_id } = req.query;
  
      if (!uni_id) {
        return res.status(400).json({ message: "University ID is required" });
      }
  
      //  Fetch only boardings where `uni_id` matches
      const [rows] = await db.query("SELECT * FROM boarding WHERE uni_id = ?", [uni_id]);
      
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching boarding details", error });
    }
  };
  

// Upload boarding image
exports.uploadBoardingImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const { board_name, board_Address, board_contact_number } = req.body;

    const query = "INSERT INTO boarding (board_name, board_Address, board_contact_number, board_image) VALUES (?, ?, ?, ?)";
    await db.query(query, [board_name, board_Address, board_contact_number, imageUrl]);

    res.status(201).json({ message: "Boarding added successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading boarding", error });
  }
};
