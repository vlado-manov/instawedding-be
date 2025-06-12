const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadImages,
  getImages,
  likeImage,
  commentImage,
} = require("../controllers/imageController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/upload", upload.array("images", 8), uploadImages);
router.get("/", getImages);
router.post("/like/:id", likeImage);
router.post("/comment/:id", commentImage);

module.exports = router;
