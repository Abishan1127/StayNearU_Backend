const db = require("../config/db");


// Get all reviews
exports.getReviews = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM review");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error });
    }
};
