import CustomError from "../error/CustomError.js";
import multer from "multer";
import cloudinary from "./cloudinaryConfig.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary storage for user photos
const userPhotoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "dosro-bazar/profiles",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        public_id: (req, file) => {
            return `user_${req.user.id}_${Date.now()}`;
        },
    },
});

// Configure Cloudinary storage for story images
const storyImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "dosro-bazar/stories",
        public_id: (req, file) => {
            return `story_${Date.now()}_${file.originalname.split('.')[0]}`;
        },
    },
});

// File filter to validate image types
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new CustomError("Please provide a valid image file", 400), false);
    }

    cb(null, true);
};

// Create multer upload middleware with dynamic storage based on field name
const imageUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            // This won't be used with Cloudinary, but required for multer
            cb(null, "/tmp");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    fileFilter: fileFilter,
});

// Override with Cloudinary storage
const cloudinaryUpload = (fieldName) => {
    const storage = fieldName === "photo" ? userPhotoStorage : storyImageStorage;
    return multer({ storage, fileFilter });
};

// Export single file upload for backward compatibility
const singleUpload = multer({
    storage: userPhotoStorage,
    fileFilter: fileFilter,
});

// Export multi-file upload for profile update
const profileUpload = multer({
    storage: userPhotoStorage,
    fileFilter: fileFilter,
}).fields([
    { name: "photo", maxCount: 1 },
    { name: "idProof", maxCount: 1 }
]);

export { cloudinaryUpload, profileUpload };
export default singleUpload;


