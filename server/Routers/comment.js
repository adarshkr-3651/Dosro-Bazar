import express from "express";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { addNewCommentToItem, getAllCommentByItem, commentLike, getCommentLikeStatus } from "../Controllers/comment.js";
import { checkItemExist } from "../Middlewares/database/databaseErrorhandler.js";

const router = express.Router();


router.post("/:slug/addComment", [getAccessToRoute, checkItemExist], addNewCommentToItem)

router.get("/:slug/getAllComment", getAllCommentByItem)

router.post("/:comment_id/like", commentLike)

router.post("/:comment_id/getCommentLikeStatus", getCommentLikeStatus)


export default router;