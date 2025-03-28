// uploadHandler.js

const multer = require("multer");

// Set up multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// Middleware to handle file upload
function uploadFile() {
    return upload.single("file");
}

module.exports = {
    uploadFile
};
