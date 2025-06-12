const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const compressImage = async (filePath, outputPath) => {
  await sharp(filePath)
    .resize({ width: 1024 })
    .jpeg({ quality: 70 })
    .toFile(outputPath);

  fs.unlinkSync(filePath); // remove original
};

module.exports = { compressImage };
