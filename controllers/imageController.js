const Image = require("../models/Image");
const { compressImage } = require("../utils/imageProcessor");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");

exports.uploadImages = async (req, res) => {
  try {
    const uploader = req.body.uploader;
    console.log("Uploader received:", req.body.uploader);

    const originalUrls = [];
    const compressedUrls = [];
    const isPortraits = [];

    for (const file of req.files) {
      // Upload original to Cloudinary
      const originalUpload = await cloudinary.uploader.upload(file.path, {
        folder: "instawedding/originals",
      });

      originalUrls.push(originalUpload.secure_url);

      // Compress image locally
      const compressedPath = `uploads/compressed-${file.filename}`;
      await compressImage(file.path, compressedPath);

      // Upload compressed to Cloudinary
      const compressedUpload = await cloudinary.uploader.upload(
        compressedPath,
        {
          folder: "instawedding/compressed",
        }
      );

      compressedUrls.push(compressedUpload.secure_url);

      // Check orientation
      const isPortrait = compressedUpload.height > compressedUpload.width;
      isPortraits.push(isPortrait);

      // Cleanup local files
      fs.unlinkSync(file.path);
      fs.unlinkSync(compressedPath);
    }

    const newImage = new Image({
      uploader,
      imageUrls: compressedUrls,
      originalUrls,
      comments: [],
      likes: 0,
      hidden: false,
      isPortrait: isPortraits[0] ?? false,
    });

    await newImage.save();
    res.json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed." });
  }
};

exports.getImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;

  const images = await Image.find({ hidden: false })
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  res.json(images);
};

exports.likeImage = async (req, res) => {
  const { userId } = req.body;
  const image = await Image.findById(req.params.id);

  if (!image.likedBy) image.likedBy = [];

  const index = image.likedBy.indexOf(userId);

  if (index === -1) {
    image.likedBy.push(userId);
  } else {
    image.likedBy.splice(index, 1);
  }

  image.likes = image.likedBy.length;

  await image.save();
  res.json({ likes: image.likes, liked: index === -1 });
};

exports.commentImage = async (req, res) => {
  const { text, user } = req.body;
  const image = await Image.findById(req.params.id);
  image.comments.push({ text, user });
  await image.save();
  res.json(image);
};
