const Image = require("../models/Image");
const { compressImage } = require("../utils/imageProcessor");
const path = require("path");

exports.uploadImages = async (req, res) => {
  const uploader = req.body.uploader;
  const compressedPaths = [];

  for (const file of req.files) {
    const compressedPath = `uploads/compressed-${file.filename}`;
    await compressImage(file.path, compressedPath);
    compressedPaths.push(compressedPath);
  }

  const newImage = new Image({
    uploader,
    imageUrls: compressedPaths,
  });

  await newImage.save();
  res.json(newImage);
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
  const image = await Image.findById(req.params.id);
  image.likes += 1;
  await image.save();
  res.json(image);
};

exports.commentImage = async (req, res) => {
  const { text, user } = req.body;
  const image = await Image.findById(req.params.id);
  image.comments.push({ text, user });
  await image.save();
  res.json(image);
};
