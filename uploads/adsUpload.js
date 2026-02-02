const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; 
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb("Ошибка: Разрешены только изображения (jpeg, jpg, png)");
  },
});

const uploadSingleImage = upload.single("image"); 

module.exports = { uploadSingleImage };
