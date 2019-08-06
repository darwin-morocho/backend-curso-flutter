const multer = require('multer');

// SET STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    req.filePath = `/uploads/${fileName}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });
module.exports = upload;
