"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseByIdHandler = exports.getCourseHandler = exports.upload = void 0;
const lodash_1 = require("lodash");
const node_1 = __importDefault(require("read-excel-file/node"));
const logger_1 = __importDefault(require("../logger"));
const course_model_1 = __importDefault(require("../model/course.model"));
const course_service_1 = require("../service/course.service");
const fs_1 = __importDefault(require("fs"));
const deploy_service_1 = __importDefault(require("../service/deploy.service"));
const dayjs_1 = __importDefault(require("dayjs"));
const upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file, 'req.file');
    console.log(req.files, 'req.files');
    try {
        let excelFile = [];
        let imgFile = [];
        let videoFile = [];
        let excelFilePath = '';
        let imgFilePath = '';
        let videoFilePath = '';
        let imgData;
        let videoData;
        if ((0, lodash_1.isArray)(req.files) && req.files.length === 2) {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].mimetype.includes("excel") || req.files[i].mimetype.includes("spreadsheetml") || req.files[i].mimetype.includes("vnd.openxmlformats-officedocument.spreadsheetml.sheet") || req.files[i].mimetype.includes("vnd.ms-excel")) {
                    excelFile.push(req.files[i]);
                }
                if (req.files[i].mimetype.includes("image/png") || req.files[i].mimetype.includes("image/jpeg") || req.files[i].mimetype.includes("image/jpg") || req.files[i].mimetype.includes("image/gif") || req.files[i].mimetype.includes("image/bmp") || req.files[i].mimetype.includes("image/tiff")) {
                    imgFile.push(req.files[i]);
                }
                if (req.files[i].mimetype.includes("video/mp4") || req.files[i].mimetype.includes("video/webm") || req.files[i].mimetype.includes("video/ogg") || req.files[i].mimetype.includes("video/quicktime") || req.files[i].mimetype.includes("video/x-msvideo") || req.files[i].mimetype.includes("video/x-flv") || req.files[i].mimetype.includes("video/x-ms-wmv") || req.files[i].mimetype.includes("video/x-ms-asf") || req.files[i].mimetype.includes("video/x-ms-wvx") || req.files[i].mimetype.includes("video/x-ms-wm") || req.files[i].mimetype.includes("video/x-ms-wmx")) {
                    videoFile.push(req.files[i]);
                }
            }
        }
        if (excelFile.length === 1) {
            excelFilePath = "./uploads/" + excelFile[0].filename;
        }
        if (imgFile.length === 1) {
            imgFilePath = "./uploads/" + imgFile[0].filename;
            imgData = fs_1.default.readFileSync(imgFilePath);
        }
        if (videoFile.length === 1) {
            videoFilePath = "./uploads/" + videoFile[0].filename;
            videoData = fs_1.default.readFileSync(videoFilePath);
        }
        // imgFilePath = "./uploads/" + imgFile[0].filename;
        // videoFilePath = "./uploads/" + videoFile[0].filename;
        console.log(excelFile, 'excelFile');
        const userId = (0, lodash_1.get)(req, "user._id");
        let videoObject = {};
        let imgObj = {};
        if (videoFile.length > 0) {
            videoObject = {
                video: {
                    data: videoData,
                    contentType: videoFile[0].mimetype
                },
                videoName: videoFile[0].originalname,
                videoType: videoFile[0].mimetype,
                path: videoFilePath,
                size: videoFile[0].size
            };
        }
        if (imgFile.length > 0) {
            imgObj = {
                originalname: imgFile[0].originalname,
                filename: imgFile[0].filename,
                destination: imgFile[0].destination,
                path: imgFile[0].path,
                size: imgFile[0].size,
                mimetype: imgFile[0].mimetype,
                img: {
                    data: imgData,
                    contentType: imgFile[0].mimetype,
                }
            };
        }
        const courses = yield (0, node_1.default)(excelFilePath);
        console.log(courses, 'courses');
        courses.shift();
        console.log(courses, 'courses');
        console.log(imgObj, 'imgObj');
        let coursesArray = [];
        let isImage = true;
        courses.forEach((row) => {
            let course = {
                user: userId,
                projectUserId: row[0],
                walletAddress: row[1],
                batchNo: row[2],
                projectName: row[3],
                courseLevel: row[4],
                courseCompleted: row[5],
                // dayjs(String(row[6])).unix()
                startDate: (0, dayjs_1.default)(String(row[6])).unix(),
                endDate: (0, dayjs_1.default)(String(row[7])).unix(),
                // startDate: row[6],
                // endDate: row[7],
                expiryDate: row[8],
                nftName: row[9],
                nftIssued: row[10],
                // email: row[8],
                // rollNo: row[9],
                // nftImage: imgObj,
            };
            if (!(0, lodash_1.isEmpty)(imgObj)) {
                course.nftImage = imgObj;
                isImage = true;
            }
            if (!(0, lodash_1.isEmpty)(videoObject)) {
                course.video = videoObject;
                course.isVideoUploaded = true;
                isImage = false;
            }
            coursesArray.push(course);
            logger_1.default.info(row);
        });
        console.log({ coursesArray, imgObj, videoObject }, 'coursesArray');
        const mediaObj = isImage ? imgObj : videoObject;
        const isNFTDeployed = yield (0, deploy_service_1.default)(coursesArray, mediaObj, isImage);
        console.log(isNFTDeployed, 'isNFTDeployed');
        if (isNFTDeployed) {
            try {
                const coursesRes = yield course_model_1.default.insertMany(coursesArray.map((course) => { return Object.assign(Object.assign({}, course), { nftIssued: true }); }));
                console.log(coursesRes, 'coursesRes');
                return res.status(200).json({
                    message: "Courses uploaded successfully",
                    courses: coursesRes,
                });
            }
            catch (error) {
                logger_1.default.error(error);
                return res.status(500).json({
                    message: "Something went wrong",
                    error,
                });
            }
        }
        if (!isNFTDeployed) {
            return res.status(500).json({
                message: "NFT deployment failed",
            });
        }
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).send(error);
    }
});
exports.upload = upload;
const getCourseHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield (0, course_service_1.findCourse)({});
        if (!courses) {
            return res.sendStatus(404);
        }
        return res.status(200).send(courses);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});
exports.getCourseHandler = getCourseHandler;
const getCourseByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield (0, course_service_1.findCourse)({ _id: req.params.id });
        if (!course) {
            return res.sendStatus(404);
        }
        return res.status(200).send(course);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
});
exports.getCourseByIdHandler = getCourseByIdHandler;
//# sourceMappingURL=excel.controller.js.map