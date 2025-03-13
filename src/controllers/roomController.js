const db = require("../config/db")
// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM room");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
};

// Get rooms by `board_id`
exports.getRoomsByBoarding = async (req, res) => {
  try {
    const { board_id } = req.query;

    if (!board_id) {
      return res.status(400).json({ message: "Boarding ID is required" });
    }

    // Fetch only rooms where `board_id` matches
    const [rooms] = await db.query("SELECT * FROM room WHERE board_id = ?", [board_id]);
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room details", error });
  }
};

// Upload room image
exports.uploadRoomImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const { user_id, board_id, start_date, end_date, booking_id } = req.body;

    const query = "INSERT INTO room (user_id, board_id, start_date, end_date, booking_id, room_image) VALUES (?, ?, ?, ?, ?, ?)";
    await db.query(query, [user_id, board_id, start_date, end_date, booking_id, imageUrl]);

    res.status(201).json({ message: "Room added successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading room", error });
  }
};
