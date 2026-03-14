import asyncErrorWrapper from "express-async-handler";
import Item from "../Models/item.js";
import Comment from "../Models/comment.js";

const addNewCommentToItem = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params

    const { star, content } = req.body

    const item = await Item.findOne({ slug: slug })

    const comment = await Comment.create({

        story: item._id,
        content: content,
        author: req.user.id,
        star: star
    })

    item.comments.push(comment._id)

    item.commentCount = item.comments.length

    await item.save();

    console.log("addNewCommentToItem function of Controllers comment.js")

    return res.status(200).json({
        success: true,
        data: comment
    })

})


const getAllCommentByItem = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params

    const item = await Item.findOne({ slug: slug })

    const commmentList = await Comment.find({
        story: item._id
    }).populate({
        path: "author",
        select: "username photo"
    }).sort("-createdAt")

    console.log("getAllCommentByItem function of Controllers comment.js")

    return res.status(200)
        .json({
            success: true,
            count: item.commentCount,
            data: commmentList
        })

})

const commentLike = asyncErrorWrapper(async (req, res, next) => {

    const { activeUser } = req.body
    const { comment_id } = req.params

    console.log("commentLike function of Controllers comment.js")


    const comment = await Comment.findById(comment_id)

    if (!comment.likes.includes(activeUser._id)) {

        comment.likes.push(activeUser._id)
        comment.likeCount = comment.likes.length;

        await comment.save();

    }
    else {

        const index = comment.likes.indexOf(activeUser._id)
        comment.likes.splice(index, 1)
        comment.likeCount = comment.likes.length
        await comment.save();
    }

    const likeStatus = comment.likes.includes(activeUser._id)

    return res.status(200)
        .json({
            success: true,
            data: comment,
            likeStatus: likeStatus
        })

})

const getCommentLikeStatus = asyncErrorWrapper(async (req, res, next) => {

    const { activeUser } = req.body
    const { comment_id } = req.params

    const comment = await Comment.findById(comment_id)
    const likeStatus = comment.likes.includes(activeUser._id)

    console.log("getCommentLikeStatus function of Controllers comment.js")

    return res.status(200)
        .json({
            success: true,
            likeStatus: likeStatus
        })

})

export {
    addNewCommentToItem,
    getAllCommentByItem,
    commentLike,
    getCommentLikeStatus
};