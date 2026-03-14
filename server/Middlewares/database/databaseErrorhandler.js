import asyncErrorWrapper from "express-async-handler";
import CustomError from "../../Helpers/error/CustomError.js";
import Item from "../../Models/item.js";


const checkItemExist = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params;
    const item = await Item.findOne({
        slug: slug
    })

    if (!item) {
        return next(new CustomError("There is no such item with that slug ", 400))
    }

    next();

})


const checkUserAndItemExist = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params

    const item = await Item.findOne({
        slug: slug,
        author: req.user
    })

    if (!item) {
        return next(new CustomError("There is no item with that slug associated with User ", 400))
    }

    next();

})

export {
    checkItemExist,
    checkUserAndItemExist
};

