"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCourse = void 0;
const course_model_1 = __importDefault(require("../model/course.model"));
function findCourse(query, options = { lean: true }) {
    return course_model_1.default.find(query, {}, options);
}
exports.findCourse = findCourse;
//# sourceMappingURL=course.service.js.map