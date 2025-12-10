const express = require("express")
const imageupload = require("../Helpers/Libraries/imageUpload");

const { getAccessToRoute } = require("../Middlewares/Authorization/auth");
const {addStory,getAllStories,detailStory,likeStory, editStory, deleteStory, editStoryPage } = require("../Controllers/story")
const { checkStoryExist, checkUserAndStoryExist } = require("../Middlewares/database/databaseErrorhandler");

console.log("Story routes module loaded in Routers story.js")

const router = express.Router() ;

// Add middleware to log all story route requests
router.use((req, res, next) => {
    console.log(`Story route request: ${req.method} ${req.path} - IP: ${req.ip} in Routers story.js`)
    next()
})

router.post("/addstory" ,[getAccessToRoute, imageupload.single("image")],addStory)
console.log("POST /addstory route registered in Routers story.js")

router.get("/getAllStories",getAllStories)
console.log("GET /getAllStories route registered in Routers story.js")

router.get("/editStory/:slug",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist] , editStoryPage)
console.log("GET /editStory/:slug route registered in Routers story.js")

router.get("/:slug/like",[getAccessToRoute,checkStoryExist] ,likeStory)
console.log("GET /:slug/like route registered in Routers story.js")

router.put("/:slug/edit",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist, imageupload.single("image")] ,editStory)
console.log("PUT /:slug/edit route registered in Routers story.js")

router.delete("/:slug/delete",[getAccessToRoute,checkStoryExist,checkUserAndStoryExist] ,deleteStory)
console.log("DELETE /:slug/delete route registered in Routers story.js")

router.get("/:slug", checkStoryExist, detailStory)
console.log("GET /:slug route registered in Routers story.js")

console.log("All story routes registered successfully in Routers story.js")

module.exports = router