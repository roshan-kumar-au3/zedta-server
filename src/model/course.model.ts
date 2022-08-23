// excel table columns - email/roll no/course name/course level/course completed(yes/no)/batch no/start date/end date/nft name/nft issued (yes/no)

import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { UserDocument } from "./user.model";

export interface CourseDocument extends mongoose.Document {
    user: UserDocument["_id"];
    courseName: string;
    courseLevel: string;
    courseCompleted: boolean;
    batchNo: string;
    startDate: Date;
    endDate: Date;
    nftName: string;
    nftIssued: boolean;
    email: string;
    rollNo: string;

    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema = new mongoose.Schema(
  {
    Id: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
  },
  { timestamps: true }
);

const Course = mongoose.model<CourseDocument>("Course", CourseSchema);

export default Course;
