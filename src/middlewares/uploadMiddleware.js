import multer from "multer";
import path from "path";

// Set up disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), process.env.FILE_STORAGE_PATH)); 
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '-');
    
    const uniqueName = Date.now() + "-" + cleanName;
    cb(null, uniqueName); 
  },
});

// File upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    // Check if the uploaded file is an image
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("File must be an image"));
    }
    cb(null, true);
  },
});

export default upload;