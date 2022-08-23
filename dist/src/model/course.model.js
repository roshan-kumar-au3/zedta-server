"use strict";
// excel table columns - email/roll no/course name/course level/course completed(yes/no)/batch no/start date/end date/nft name/nft issued (yes/no)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const nanoid_1 = require("nanoid");
const CourseSchema = new mongoose_1.default.Schema({
    Id: {
        type: String,
        required: true,
        unique: true,
        default: () => (0, nanoid_1.nanoid)(10),
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    courseName: { type: String, require: true },
    courseLevel: { type: String, required: true },
    courseCompleted: { type: Boolean, default: false, required: true },
    batchNo: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    nftName: { type: String, required: true },
    nftIssued: { type: Boolean, default: false, required: true },
    email: { type: String, required: true },
    rollNo: { type: String, required: true },
}, { timestamps: true });
const Course = mongoose_1.default.model("Course", CourseSchema);
exports.default = Course;
