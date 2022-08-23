import { Request, Response } from "express";
import { get } from "lodash";
import readXlsxFile from "read-excel-file/node";
import log from '../logger';
import Course from "../model/course.model";
import { findCourse } from "../service/course.service";

export const upload = async (req: Request, res: Response) => {
  try {
    log.info(req, '-req----');
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    const userId = get(req, "user._id");
    let path = "./uploads/" + req.file.filename;
    log.info(req.file);
    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();
      log.info(rows, '---rows ----');
      let courses: any = [];
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
        log.info(row);
      });
      Course.insertMany(courses).then((courses) => {
        log.info(courses, '---courses ----');
        return res.send(courses);
      }).catch((err) => {
        log.error(err);
        return res.status(500).send(err);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req?.file?.originalname,
    });
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

