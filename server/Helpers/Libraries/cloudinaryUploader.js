import cloudinary from './cloudinaryConfig.js';
import streamifier from 'streamifier';

/**
 * Upload a buffer to Cloudinary as a raw file (PDF)
 * @param {Buffer} buffer - The file buffer
 * @param {string} folder - Optional folder name
 * @param {string} publicId - Optional public ID
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadPDF = (buffer, folder = 'invoices', publicId = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            folder: folder,
            resource_type: 'raw', // Critical for PDF
            format: 'pdf',
            access_mode: 'public'
        };
        
        if (publicId) options.public_id = publicId;

        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};
