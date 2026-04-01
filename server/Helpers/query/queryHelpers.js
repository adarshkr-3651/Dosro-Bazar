/**
 * Escapes special characters for use in a regular expression
 */
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const searchHelper = (searchKey, query, req) => {
    if (req.query.search && typeof req.query.search === 'string') {
        const sanitizedSearch = escapeRegex(req.query.search);
        const searchObject = {};
        const regex = new RegExp(sanitizedSearch, "i");

        searchObject[searchKey] = regex;
        query = query.where(searchObject);

        return query;
    }

    return query;
};

const paginateHelper = async (model, query, req, searchKey = "title") => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * pageSize;

    let total;
    if (req.query.search && typeof req.query.search === 'string') {
        const sanitizedSearch = escapeRegex(req.query.search);
        const regex = new RegExp(sanitizedSearch, "i");
        const searchObject = {};
        searchObject[searchKey] = regex;
        total = await model.countDocuments(searchObject);
    } else {
        total = await model.countDocuments();
    }

    const pages = Math.ceil(total / pageSize);
    query = query.skip(skip).limit(pageSize);

    return {
        query: query,
        page: page,
        pages: pages
    };
};

export {
    searchHelper,
    paginateHelper
};