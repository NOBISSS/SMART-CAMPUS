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

const deleteSyllabus = asyncHandler(async (req, res) => {
  const syllabusId = req.params.syllabusId;

  try {
    const syllabus = await Syllabus.findByIdAndDelete(syllabusId);

    if (!syllabus) {
      throw new ApiError(400, { message: "Syllabus not found" });
    }
    return res
      .status(200)
      .json(new ApiResponse(200, syllabus, "Syllabus deleted successfully"));
  } catch (err) {
    return res.status(err.statusCode).json(err.message);
  }
});

const updateSyllabus = asyncHandler(async (req, res) => {
  const syllabusId = req.params.syllabusId;
  const { subjectName, semester } = req.body;
  const syllabusFileLocalPath = req.file?.path;
  if (
    [subjectName, semester, syllabusFileLocalPath].some((field) => {
      return field?.trim() === "";
    })
  )
    throw new ApiError(400, { message: "All fields are required" });
  let syllabusFile;
  try {
    syllabusFile = await uploadOnCloudinary(syllabusFileLocalPath);
    if (!syllabusFile) {
      throw new ApiError(404, { message: "Local path not found" });
    }
  } catch (error) {
    throw new ApiError(500, {
      message: "Someting went wrong while uploading syllabus file",
    });
  }
  try {
    const syllabus = await Syllabus.findByIdAndUpdate(
      syllabusId,
      {
        subjectName: subjectName,
        semester: _.toNumber(semester),
        syllabusFile: syllabusFile?.secure_url,
      },
      { new: true }
    );
    if (!syllabus) {
      throw new ApiError(400, { message: "No syllabus found" });
    }
    await syllabus.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, syllabus, "Syllabus updated successfully"));
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(
        new ApiResponse(
          error.statusCode,
          {},
          error.message || "Someting went wrong while updating syllabus"
        )
      );
  }
});

const checkSyllabusToAdmin = asyncHandler(async (req, res) => {
  const semester = req.body.semester;
  try {
    if (semester === "")
      throw new ApiError(400, { message: "Semester is required" });
    const syllabusAsSemester = await Syllabus.aggregate([
      {
        $match: {
          semester: _.toNumber(semester),
        },
      },
      {
        $project: {
          subjectName: 1,
          semester: 1,
          syllabusFile: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (!syllabusAsSemester) {
      throw new ApiError(404, {
        message: `No syllabus found for semester ${semester}`,
      });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          syllabusAsSemester,
          `${syllabusAsSemester.length} found syllabus for semester ${semester} fetched successfully`
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(
        new ApiResponse(
          error.statusCode,
          {},
          error.message || "Someting went wrong while updating syllabus"
        )
      );
  }
});

const getSyllabusForStudents = asyncHandler(async (req,res) => {
  const semester = req.user.semester;
  if (semester === "")
    throw new ApiError(400, { message: "Semester is required" });
  try {
    const syllabusAsSemester = await Syllabus.aggregate([
      {
        $match: {
          semester: _.toNumber(semester),
        },
      },
      {
        $project: {
          subjectName: 1,
          semester: 1,
          syllabusFile: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (!syllabusAsSemester) {
      throw new ApiError(404, {
        message: `No syllabus found for semester ${semester}`,
      });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          syllabusAsSemester,
          `${syllabusAsSemester.length} found syllabus for semester ${semester} fetched successfully`
        )
      );
  } catch (error) {
    return res
      .status(error.statusCode)
      .json(
        new ApiResponse(
          error.statusCode,
          {},
          error.message || "Someting went wrong while updating syllabus"
        )
      );
  }
})

export { checkSyllabusToAdmin, deleteSyllabus, setSyllabus, updateSyllabus,getSyllabusForStudents };
