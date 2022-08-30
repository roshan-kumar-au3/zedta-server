"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const excelFilter = (req, file, cb) => {
    console.log(file, 'file filter line no. 8');
    if (file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml") ||
        file.mimetype.includes("vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
        file.mimetype.includes("vnd.ms-excel") ||
        file.mimetype.includes("image/png") ||
        file.mimetype.includes("image/jpeg") ||
        file.mimetype.includes("image/jpg") ||
        file.mimetype.includes("image/gif") ||
        file.mimetype.includes("image/bmp") ||
        file.mimetype.includes("image/tiff") ||
        file.mimetype.includes("image/webp") ||
        file.mimetype.includes("video/mp4") ||
        file.mimetype.includes("video/webm") ||
        file.mimetype.includes("video/ogg") ||
        file.mimetype.includes("video/quicktime") ||
        file.mimetype.includes("video/x-msvideo") ||
        file.mimetype.includes("video/x-flv") ||
        file.mimetype.includes("video/x-ms-wmv") ||
        file.mimetype.includes("video/x-ms-asf") ||
        file.mimetype.includes("video/x-ms-wvx") ||
        file.mimetype.includes("video/x-ms-wm") ||
        file.mimetype.includes("video/x-ms-wmx")) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
var storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
    },
});
var uploadFile = (0, multer_1.default)({ storage: storage, fileFilter: excelFilter });
exports.default = uploadFile;
//# sourceMappingURL=multer.js.map