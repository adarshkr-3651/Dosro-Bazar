
import CustomError from "../server/Helpers/error/CustomError.js";

// Mocking the fileFilter logic from imageUpload.js
const fileFilter = (file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Please provide a valid image file"), false);
    }
    cb(null, true);
};

const testFormats = [
    { mimetype: "image/jpeg", name: "jpg" },
    { mimetype: "image/png", name: "png" },
    { mimetype: "image/webp", name: "webp" },
    { mimetype: "image/gif", name: "gif" },
    { mimetype: "image/svg+xml", name: "svg" },
    { mimetype: "image/avif", name: "avif" },
    { mimetype: "application/pdf", name: "pdf", shouldFail: true }
];

console.log("Testing fileFilter logic...");

testFormats.forEach(test => {
    fileFilter(test, (err, result) => {
        if (test.shouldFail) {
            if (err) {
                console.log(`✓ correctly rejected ${test.mimetype}`);
            } else {
                console.error(`✗ FAILED to reject ${test.mimetype}`);
            }
        } else {
            if (result === true && !err) {
                console.log(`✓ accepted ${test.mimetype}`);
            } else {
                console.error(`✗ FAILED to accept ${test.mimetype}: ${err?.message}`);
            }
        }
    });
});
