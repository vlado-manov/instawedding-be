const sharp = require("sharp");
const compressImage = async (filePath, outputPath) => {
  await sharp(filePath)
    .rotate()
    .resize({ width: 1024, withoutEnlargement: true })
    .jpeg({ quality: 70, progressive: true })
    .toFile(outputPath);
};

module.exports = { compressImage };
