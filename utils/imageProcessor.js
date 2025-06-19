const sharp = require("sharp");
const compressImage = async (filePath, outputPath) => {
  await sharp(filePath)
    .rotate()
    .resize({ width: 1024 })
    .jpeg({ quality: 70 })
    .toFile(outputPath);
};

module.exports = { compressImage };
