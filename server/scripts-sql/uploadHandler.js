// uploadHandler.js
const multer = require("multer");

// Set up multer to handle file uploads
const upload = multer({ dest: "scripts-sql/temp_uploads/" });

// Middleware to handle file upload
function uploadFile() {
    return upload.single("file");
}

module.exports = {
    uploadFile
};
