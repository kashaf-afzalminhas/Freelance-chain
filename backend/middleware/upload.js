const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const uploadDir = 'uploads/profile-images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save to this directory
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Example: 1688349283748.jpg
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
  }
};

// Set up multer with storage, file filter, and size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB size limit
});

module.exports = upload;
