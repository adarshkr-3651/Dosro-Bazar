import cloudinary from "./cloudinaryConfig.js";

/**
 * Extracts the public_id from a Cloudinary URL
 * Example: https://res.cloudinary.com/cloudname/image/upload/v12345/folder/public_id.jpg
 * returns "folder/public_id"
 */
const getPublicIdFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    // Split by '/upload/' to get the part after the versioning/transformations
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    // Get the part after the version (v123456789/)
    const afterUpload = parts[1];
    const subParts = afterUpload.split('/');
    
    // If the first part starts with 'v' followed by numbers, it's the version
    let startIndex = 0;
    if (subParts[0].match(/^v\d+$/)) {
        startIndex = 1;
    }
    
    // Join the remaining parts and remove the file extension
    const fullPath = subParts.slice(startIndex).join('/');
    return fullPath.split('.')[0];
};

const deleteImageFile = async (req, deleteImageUrl) => {
    if (!deleteImageUrl || typeof deleteImageUrl !== 'string') return;

    const publicId = getPublicIdFromUrl(deleteImageUrl);
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId);
        // console.log(`[Cloudinary] Deleted image: ${publicId}`);
    } catch (error) {
        console.error(`[Cloudinary] Failed to delete image ${publicId}:`, error.message);
    }
};

export default deleteImageFile;