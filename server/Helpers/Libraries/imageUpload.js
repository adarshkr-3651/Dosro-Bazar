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
    // Next.js Server Actions often send files with generic application/octet-stream or application/x-msdownload 
    // instead of explicit image/ mimetypes. We should allow these and let Cloudinary's deep inspection validate them.
    const isImageSyntax = file.mimetype.startsWith("image/");
    const isGenericBinary = file.mimetype === "application/octet-stream" || file.mimetype === "application/x-msdownload";

    if (!isImageSyntax && !isGenericBinary) {
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
    let storage;
    if (fieldName === "photo") storage = userPhotoStorage;
    else if (fieldName === "ad" || fieldName === "image") storage = advertisementStorage;
    else storage = storyImageStorage;

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


