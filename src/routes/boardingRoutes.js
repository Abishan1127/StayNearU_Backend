const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { getBoardingDetail, uploadBoardingImage,getBoardingDetailsByUniId } = require("../controllers/boardingController");

router.get("/", getBoardingDetailsByUniId);
router.get("/get",getBoardingDetail)
router.post("/upload", upload.single("board_image"), uploadBoardingImage);

module.exports = router;
