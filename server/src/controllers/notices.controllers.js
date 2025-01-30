import _ from "lodash";
import { Notice } from "../models/notices.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const createNotice = asyncHandler(async (req, res) => {
  const { noticeTitle, noticeDisc, semester } = req.body;
  if (
    [noticeTitle, noticeDisc, semester].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const noticeImageLocalPath = req.file?.path; // Not req.files for single upload

  // console.log(noticeImageLocalPath);
  let noticeImage;
  try {
    if (noticeImageLocalPath) {
      noticeImage = await uploadOnCloudinary(noticeImageLocalPath);
    }
    // console.log(noticeImage);
  } catch (err) {
    throw new ApiError(500, { message: "Failed to upload noticeImage" });
  }
  try {
    const newNotice = await Notice.create({
      NoticeHeading: noticeTitle,
      semester: _.toNumber(semester),
      NoticeDetails: noticeDisc,
      NoticeImage: noticeImage?.secure_url || "",
    });
    // console.log(newNotice);
    const createdNotice = await Notice.findById(newNotice._id);
    if (!createdNotice) {
      throw new ApiError(500, {
        message: "Something went wrong while creating an notice",
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdNotice, "notice Created Successfully"));
  } catch (err) {
    if (noticeImage) {
      await deleteFromCloudinary(noticeImage.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while creating notice and images were deleted"
    );
  }
});

const displayNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.aggregate([
    {
      $project: {
        _id: 1,
        NoticeHeading: 1,
        NoticeDetails: 1,
        semester: 1,
        NoticeImage: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  if (!notices) {
    throw new ApiError(300, "No notices found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notices,
        `${notices.length} Notices fetched successfully`
      )
    );
});
const displayNoticesStudents = asyncHandler(async (req, res) => {
  const studentSemester = req.user.semester;
  const notices = await Notice.aggregate([
    {
      $match: {
        semester: studentSemester,
      },
    },
    {
      $project: {
        _id: 1,
        NoticeHeading: 1,
        NoticeDetails: 1,
        semester: 1,
        NoticeImage: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
  if (!notices) {
    throw new ApiError(300, "No notices found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notices,
        `${notices.length} Events fetched successfully`
      )
    );
});

const updateNotice = asyncHandler(async (req, res) => {
  const { noticeId } = req.params;
  const { newTitle, newDesc, semester } = req.body;
  if (
    [newTitle, newDesc, semester].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // const notice = await notice.findById(noticeId);
  const noticeImageLocalPath = req.file?.path; // Not req.files for single upload
  console.log(noticeImageLocalPath);
  let noticeImage;
  try {
    if (noticeImageLocalPath) {
      noticeImage = await uploadOnCloudinary(noticeImageLocalPath);
    }
    console.log(noticeImage);
  } catch (err) {
    throw new ApiError(500, { message: "Failed to upload noticeImage" });
  }
  const notice = await Notice.findByIdAndUpdate(
    noticeId,
    {
      $set: {
        NoticeHeading: newTitle,
        NoticeDetails: newDesc,
        semester: _.toNumber(semester),
        NoticeImage: noticeImage?.secure_url,
      },
    },
    { new: true }
  );
  if (!notice) {
    throw new ApiError(404, "notice Not found");
  }
  // if (notice.noticeImage) { //get logic from vidshare and change it later on.
  //   await deleteFromCloudinary(notice.noticeImage)
  // }
  await notice.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, notice, "notice Updated successfully"));
});

const deleteNotice = asyncHandler(async (req, res) => {
  const { noticeId } = req.params;

  const notice = await Notice.findByIdAndDelete(noticeId);
  if (!notice) throw new ApiError(404, "notice not found");
  return res
    .status(200)
    .json(new ApiResponse(200, notice, "notice Deleted Successfully"));
});

export {
  createNotice,
  deleteNotice,
  displayNotices,
  displayNoticesStudents,
  updateNotice,
};
