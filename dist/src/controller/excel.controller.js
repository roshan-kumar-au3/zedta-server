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
exports.getCourseHandler = exports.upload = void 0;
const lodash_1 = require("lodash");
const node_1 = __importDefault(require("read-excel-file/node"));
const logger_1 = __importDefault(require("../logger"));
const course_model_1 = __importDefault(require("../model/course.model"));
const course_service_1 = require("../service/course.service");
const upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        logger_1.default.info(req, '-req----');
        if (req.file == undefined) {
            return res.status(400).send("Please upload an excel file!");
        }
        const userId = (0, lodash_1.get)(req, "user._id");
        let path = "./uploads/" + req.file.filename;
        logger_1.default.info(req.file);
        (0, node_1.default)(path).then((rows) => {
            // skip header
            rows.shift();
            logger_1.default.info(rows, '---rows ----');
            let courses = [];
            rows.forEach((row) => {
                let course = {
                    user: userId,
                    courseName: row[0],
                    courseLevel: row[1],
                    courseCompleted: row[2],
                    batchNo: row[3],
                    startDate: row[4],
                    endDate: row[5],
                    nftName: row[6],
                    nftIssued: row[7],
                    email: row[8],
                    rollNo: row[9],
                };
                courses.push(course);
                logger_1.default.info(row);
            });
            course_model_1.default.insertMany(courses).then((courses) => {
                logger_1.default.info(courses, '---courses ----');
                return res.send(courses);
            }).catch((err) => {
                logger_1.default.error(err);
                return res.status(500).send(err);
            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.originalname),
        });
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
