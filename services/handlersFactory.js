const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) => asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({
        statusCode: 201,
        message: `document created successfully`,
        data: document,
    });
});

exports.getOne = (Model) => asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const document = await Model.findById(id);

    if (!document) {
        return next(new ApiError(404, `No document found with this id ${id}`));
    }

    res.status(200).json({
        statusCode: 200,
        data: document,
    });
});

exports.getAll = (Model, modelName = "") => asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj
    }

    // Build query
    const documentsCount = await Model.countDocuments();
    const apiFeatures = await new ApiFeatures(Model.find(filter), req.query, req).filter().sort(modelName).fieldLimiting().search().paginate(documentsCount);

    // Execute query
    const {mongooseQuery, paginationResult} = apiFeatures;
    const document = await mongooseQuery;

    res.status(200).json({
        statusCode: 200,
        results: document.length,
        data: document,
        metadata: paginationResult,
    });
});

exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!document) {
        return next(new ApiError(404, `No document found with this id ${req.params.id}`));
    }

    res.status(200).json({
        statusCode: 200,
        message: `document updated successfully`,
        data: document,
    });
});

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const {id} = req.params;

        const document = await Model.findByIdAndDelete(id);

        if (!document) {
            return next(new ApiError(404, `No document found with this id ${id}`));
        }

        res.status(200).json({
            statusCode: 200,
            message: `document deleted successfully`,
        });
    });

