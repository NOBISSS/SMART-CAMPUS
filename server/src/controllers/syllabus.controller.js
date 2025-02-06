import _ from "lodash";
import { Syllabus } from "../models/syllabus.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const setSyllabus = asyncHandler(async (req, res) => {
  const { subjectName, semester } = req.body;
  const syllabusFileLocalPath = req.file?.path;
  if (
    [subjectName, semester, syllabusFileLocalPath].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, { message: "All fields are required" });
  }
  let syllabusFile;
  try {
    if (syllabusFileLocalPath) {
      syllabusFile = await uploadOnCloudinary(syllabusFileLocalPath);
    }
  } catch (error) {
    throw new ApiError(500, { message: "Failed to upload Syllabus file" });
  }
  try {
    const syllabus = await Syllabus.create({
      subjectName: subjectName,
      semester: _.toNumber(semester),
      syllabusFile: syllabusFile?.secure_url,
    });
    const createdSyllabus = await Syllabus.findById(syllabus._id);
    if (!createdSyllabus) {
      throw new ApiError(400, {
        message: "Something Went wrong while creating syllabus",
      });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, createdSyllabus, "Syllabus Created Successfully")
      );
  } catch (error) {
    return res
      .status(err.statusCode || 500)
      .json(err.message || "Something went wrong from our side");
  }
});

export { setSyllabus };
