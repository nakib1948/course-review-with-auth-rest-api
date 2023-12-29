import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { courseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await courseServices.createCourseIntoDB(req.body,req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getAllCourseFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getBestCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getBestCourseFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Best course retrieved successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await courseServices.updateCourseIntoDB(courseId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course updateded successfully',
    data: result,
  });
});

const getCourseWithReview = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await courseServices.getCourseWithReviews(courseId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course and Reviews retrieved successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourse,
  updateCourse,
  getCourseWithReview,
  getBestCourse,
};
