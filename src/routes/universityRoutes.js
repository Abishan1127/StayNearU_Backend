const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { getUniversities, uploadUniversityImage,createUniversity } = require("../controllers/universityController");




router.get("/", getUniversities);
router.post("/upload", upload.single("uni_image"), uploadUniversityImage);
router.post("/", upload.single("uni_image"), createUniversity);


module.exports = router;
