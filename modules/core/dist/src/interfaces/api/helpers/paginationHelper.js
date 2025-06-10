"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePageNumbers = exports.generatePaginationLinks = void 0;
const generatePaginationLinks = (baseUrl, pagination, queryParams = {}) => {
    const { page, pages, hasNext, hasPrev } = pagination;
    const additionalParams = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&');
    const queryPrefix = additionalParams ? `&${additionalParams}` : '';
    const links = {
        first: `${baseUrl}?page=1&limit=${pagination.limit}${queryPrefix}`,
        last: `${baseUrl}?page=${pages}&limit=${pagination.limit}${queryPrefix}`,
    };
    if (hasPrev) {
        links.prev = `${baseUrl}?page=${page - 1}&limit=${pagination.limit}${queryPrefix}`;
    }
    if (hasNext) {
        links.next = `${baseUrl}?page=${page + 1}&limit=${pagination.limit}${queryPrefix}`;
    }
    return links;
};
exports.generatePaginationLinks = generatePaginationLinks;
const generatePageNumbers = (pagination, maxPages = 5) => {
    const { page, pages } = pagination;
    if (pages <= maxPages) {
        return Array.from({ length: pages }, (_, i) => i + 1);
    }
    let startPage = Math.max(1, page - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;
    if (endPage > pages) {
        endPage = pages;
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};
exports.generatePageNumbers = generatePageNumbers;
//# sourceMappingURL=paginationHelper.js.map