class ApiFeatures {
    constructor(mongooseQuery, queryString, request = null) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
        this.request = request;

    }

    filter() {
        const queryStringObj = {...this.queryString};
        const exludeFields = ["page", "limit", "sort", "fields"];
        exludeFields.forEach(field => delete queryStringObj[field]);

        // Apply filteration using [gte, gt, lte, lt]
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            // price, -sold - => [price, -sold] price -sold
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }

    fieldLimiting() {
        if (this.queryString.fields) {
            // title,rating,coverImage,price
            const fields = this.queryString.fields.split(",").join(" ");
            // title rating coverImage price
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === "Products") {
                query.$or = [
                    {title: {$regex: this.queryString.keyword, $options: 'i'}},
                    {description: {$regex: this.queryString.keyword, $options: 'i'}},
                ];
            } else {
                query = {name: {$regex: this.queryString.keyword, $options: 'i'}};
            }

            this.mongooseQuery = this.mongooseQuery.find(query);
        }

        return this;
    }

    paginate(documentsCount) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        // Total number of items
        const totalResults = documentsCount; // Clone query to avoid conflict
        const totalPages = Math.ceil(documentsCount / limit); // Total number of pages

        let links = null;
        let pagination = {};

        if (this.request) {
            const baseUrl = `${this.request.protocol}://${this.request.get("host")}${
                this.request.originalUrl.split("?")[0]
            }`; // Base URL

            const createLink = (pageNumber) =>
                `${baseUrl}?page=${pageNumber}&limit=${limit}`;

            links = [
                {self: createLink(page)},
                {first: createLink(1)},
                {previous: page > 1 ? createLink(page - 1) : null},
                {next: page < totalPages ? createLink(page + 1) : null},
                {last: createLink(totalPages)},
            ].filter((link) => Object.values(link)[0] !== null); // Filter out null links
        }

        pagination = {page, limit, totalResults, totalPages, links};


        this.mongooseQuery = this.mongooseQuery.skip(skip)
            .limit(limit);

        this.paginationResult = pagination;
        return this;

    }
}

module.exports = ApiFeatures;