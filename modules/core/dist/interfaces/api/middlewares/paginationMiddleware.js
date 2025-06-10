"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPaginatedResponse = exports.createPaginationMetadata = exports.paginationMiddleware = void 0;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const paginationMiddleware = (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || DEFAULT_PAGE;
        let limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        if (page < 1) {
            res.status(400).json({
                status: 'error',
                message: 'Page number must be greater than or equal to 1',
            });
            return;
        }
        if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }
        const skip = (page - 1) * limit;
        req.pagination = { page, limit, skip };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.paginationMiddleware = paginationMiddleware;
const createPaginationMetadata = (totalItems, pagination) => {
    const { page, limit } = pagination;
    const totalPages = Math.ceil(totalItems / limit);
    return {
        total: totalItems,
        page,
        limit,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
};
exports.createPaginationMetadata = createPaginationMetadata;
const formatPaginatedResponse = (data, totalItems, pagination) => {
    return {
        status: 'success',
        data,
        pagination: (0, exports.createPaginationMetadata)(totalItems, pagination),
    };
};
exports.formatPaginatedResponse = formatPaginatedResponse;
//# sourceMappingURL=paginationMiddleware.js.map