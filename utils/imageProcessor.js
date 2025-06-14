const sharp = require("sharp");
const compressImage = async (filePath, outputPath) => {
  await sharp(filePath)
    .resize({ width: 1024 })
    .jpeg({ quality: 70 })
    .toFile(outputPath);
};

module.exports = { compressImage };
