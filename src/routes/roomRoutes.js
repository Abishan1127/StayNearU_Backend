const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {  uploadRoomImage } = require("../controllers/roomController");
const { getRoomsByBoarding ,getRooms} = require("../controllers/roomController");


router.post("/upload", upload.single("room_image"), uploadRoomImage);
router.get("/", getRoomsByBoarding);
router.get("/all", getRooms);

module.exports = router;
