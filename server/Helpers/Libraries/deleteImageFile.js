import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = (req, deleteImage) => {

    // For Cloudinary images, we don't need to delete local files.
    // Ideally we should delete from Cloudinary using their API.
    // For now, let's just log and return to prevent crashes with local file logic.
    console.log("[deleteImageFile] Request to delete image:", deleteImage || "No image specified");
    return;

    // Legacy local deletion logic
    // const rootDir = path.resolve(__dirname, "../../");
    // filePath = path.join(rootDir, `/public/storyImages/${deleteImage}`)
    // fs.unlink(filePath, (res) => console.log(res, "file delete "));

}


export default deleteImageFile;