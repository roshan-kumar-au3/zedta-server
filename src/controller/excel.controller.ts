import { Request, Response } from "express";
import { get, isArray, isEmpty } from "lodash";
import readXlsxFile from "read-excel-file/node";
import log from '../logger';
import Course from "../model/course.model";
import { findCourse } from "../service/course.service";
import fs from 'fs';
import deployNFT from "../service/deploy.service";
import dayjs from "dayjs";
export const upload = async (req: Request, res: Response) => {
  console.log(req.file, 'req.file');
  console.log(req.files, 'req.files');
  try {

    let excelFile = [];
    let imgFile = [];
    let videoFile = [];
    let excelFilePath = '';
    let imgFilePath = '';
    let videoFilePath = '';
    let imgData: any;
    let videoData: any;

    if (isArray(req.files) && req.files.length === 2) {
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
      imgData = fs.readFileSync(imgFilePath);
    }
    if (videoFile.length === 1) {
      videoFilePath = "./uploads/" + videoFile[0].filename;
      videoData = fs.readFileSync(videoFilePath);
    }
    // imgFilePath = "./uploads/" + imgFile[0].filename;
    // videoFilePath = "./uploads/" + videoFile[0].filename;
    console.log(excelFile, 'excelFile');
    const userId = get(req, "user._id");

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
      }
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
      }
    }
    const courses = await readXlsxFile(excelFilePath);
    console.log(courses, 'courses');
    courses.shift();
    console.log(courses, 'courses');
    console.log(imgObj, 'imgObj');
    let coursesArray: any = [];
    let isImage: Boolean = true;
    courses.forEach((row) => {
      let course: any = {
        user: userId,
        projectUserId: row[0],
        walletAddress: row[1],
        batchNo: row[2],
        projectName: row[3],
        courseLevel: row[4],
        courseCompleted: row[5],
        // dayjs(String(row[6])).unix()
        startDate: dayjs(String(row[6])).unix(),
        endDate: dayjs(String(row[7])).unix(),
        // startDate: row[6],
        // endDate: row[7],
        expiryDate: row[8],
        nftName: row[9],
        nftIssued: row[10],
        // email: row[8],
        // rollNo: row[9],
        // nftImage: imgObj,
      };
      if (!isEmpty(imgObj)) {
        course.nftImage = imgObj;
        isImage = true;
      }
      if (!isEmpty(videoObject)) {
        course.video = videoObject;
        course.isVideoUploaded = true;
        isImage = false;
      }
      coursesArray.push(course);
      log.info(row);
    });

    console.log({ coursesArray, imgObj, videoObject }, 'coursesArray');

    const mediaObj = isImage ? imgObj: videoObject;

    const isNFTDeployed = await deployNFT(coursesArray, mediaObj, isImage);
    console.log(isNFTDeployed, 'isNFTDeployed');
    if (isNFTDeployed) {
      try {
        const coursesRes = await Course.insertMany(coursesArray.map((course: any) => { return { ...course, nftIssued: true } }));
        console.log(coursesRes, 'coursesRes');
        return res.status(200).json({
          message: "Courses uploaded successfully",
          courses: coursesRes,
        });
      } catch (error: any) {
        log.error(error);
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

  } catch (error: any) {
    log.error(error);
    res.status(500).send(error);

  }
};

export const getCourseHandler = async (req: Request, res: Response) => {
  try {
    const courses = await findCourse({});
    if (!courses) {
      return res.sendStatus(404);
    }
    return res.status(200).send(courses);
  } catch (error: any) {
    log.error(error)
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}

export const getCourseByIdHandler = async (req: Request, res: Response) => {
  try {
    const course = await findCourse({ _id: req.params.id });
    if (!course) {
      return res.sendStatus(404);
    }
    return res.status(200).send(course);
  } catch (error: any) {
    log.error(error)
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}