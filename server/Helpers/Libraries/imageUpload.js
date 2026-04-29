import CustomError from "../error/CustomError.js";
import multer from "multer";
import cloudinary from "./cloudinaryConfig.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import os from "os";

// Configure Cloudinary storage for user photos
const userPhotoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "dosro-bazar/profiles",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        public_id: (req, file) => {
            return `user_${req.user?.id || 'guest'}_${Date.now()}`;
        },
    },
});

// Configure Cloudinary storage for advertisement images
const advertisementStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "dosro-bazar/advertisements",
        public_id: (req, file) => {
            return `ad_${Date.now()}_${file.originalname.split('.')[0]}`;
        },
    },
});

// Configure Cloudinary storage for chat attachments (images and PDFs)
const chatFileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "dosro-bazar/chat",
        resource_type: "auto", // Automatically detect file type (image or raw/pdf)
        public_id: (req, file) => {
            return `chat_${Date.now()}_${file.originalname.split('.')[0]}`;
        },
    },
});

// File filter to validate image and PDF types
const fileFilter = (req, file, cb) => {
    const isImageSyntax = file.mimetype.startsWith("image/");
    const isGenericBinary = file.mimetype === "application/octet-stream" || file.mimetype === "application/x-msdownload";
    const isPDF = file.mimetype === "application/pdf";

    if (!isImageSyntax && !isGenericBinary && !isPDF) {
        return cb(new CustomError("Please provide a valid image or PDF file", 400), false);
    }

    cb(null, true);
};

const limits = {
    fileSize: 5 * 1024 * 1024 // 5 MB LIMIT
};

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

// Create multer upload middleware with dynamic storage based on field name
const imageUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, os.tmpdir());
        },
        filename: function (req, file, cb) {
            cb(null, `upload_${Date.now()}_${file.originalname}`);
        },
    }),
    fileFilter: fileFilter,
    limits: limits
});

// Override with Cloudinary storage
const cloudinaryUpload = (fieldName) => {
    let storage;
    if (fieldName === "photo") storage = userPhotoStorage;
    else if (fieldName === "ad" || fieldName === "image") storage = advertisementStorage;
    else if (fieldName === "chat") storage = chatFileStorage;
    else storage = storyImageStorage;

    return multer({ storage, fileFilter, limits });
};

// Export single file upload for backward compatibility
const singleUpload = multer({
    storage: userPhotoStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB for profile pics
});

// Export multi-file upload for profile update
const profileUpload = multer({
    storage: userPhotoStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 } // 3MB for ID proofs
}).fields([
    { name: "photo", maxCount: 1 },
    { name: "idProof", maxCount: 1 }
]);

export { cloudinaryUpload, profileUpload };
export default singleUpload;


