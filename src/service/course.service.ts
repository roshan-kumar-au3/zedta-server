import { FilterQuery, QueryOptions } from "mongoose";
import Course, { CourseDocument } from "../model/course.model";

export function findCourse(
    query: FilterQuery<CourseDocument>,
    options: QueryOptions = { lean: true }
  ) {
    return Course.find(query, {}, options);
  }