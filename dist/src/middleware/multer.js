"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const excelFilter = (req, file, cb) => {
    if (file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml")) {
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
