import { Express, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const excelFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  console.log(file, 'file filter line no. 8');
  if (
    file.mimetype.includes("excel") ||
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
    file.mimetype.includes("video/x-ms-wmx")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
var storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
    cb(null, "./uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: excelFilter });

export default uploadFile;