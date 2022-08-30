// excel table columns - email/roll no/course name/course level/course completed(yes/no)/batch no/start date/end date/nft name/nft issued (yes/no)

import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { UserDocument } from "./user.model";

export interface CourseDocument extends mongoose.Document {
    user: UserDocument["_id"];
    courseLevel: string;
    courseCompleted: boolean;
    batchNo: string;
    startDate: Date;
    endDate: Date;
    nftName: string;
    nftIssued: boolean;
    // email: string;
    // rollNo: string;
    projectUserId: string;
    walletAddress: string;
    projectName: string;
    createdAt: Date;
    updatedAt: Date;
    nftImage: Object;
    video: Object;
    isVideoUploaded: boolean;
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
    projectName: { type: String, require: true },
    courseLevel: { type: String, required: true },
    courseCompleted: { type: Boolean, default: false, required: true },
    batchNo: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    nftName: { type: String, required: true },
    nftIssued: { type: Boolean, default: false, required: true },
    // email: { type: String, required: true },
    // rollNo: { type: String, required: true },
    walletAddress: { type: String, required: true },
    projectUserId: { type: String, required: true },
    expiryDate: { type: Date },
    nftImage: { type: Object },
    video: { type: Object },
    isVideoUploaded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Course = mongoose.model<CourseDocument>("Course", CourseSchema);

export default Course;
