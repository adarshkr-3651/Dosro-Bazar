import express from "express";
import imageUpload from "../Helpers/Libraries/imageUpload.js";
import { profile, editProfile, changePassword, addItemToReadList, readListPage, toggleFavorite, getFavorites } from "../Controllers/user.js";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { profileUpload } from "../Helpers/Libraries/imageUpload.js";


const router = express.Router();

router.get("/profile", getAccessToRoute, profile)

router.post("/editProfile", [getAccessToRoute, profileUpload], editProfile)

router.put("/changePassword", getAccessToRoute, changePassword)

router.post("/:slug/addItemToReadList", getAccessToRoute, addItemToReadList)

router.get("/readList", getAccessToRoute, readListPage)



router.get("/favorites", getAccessToRoute, getFavorites);

router.post("/:slug/favorite", getAccessToRoute, toggleFavorite);

export default router;