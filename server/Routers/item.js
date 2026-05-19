import express from "express";
import { cloudinaryUpload } from "../Helpers/Libraries/imageUpload.js";

import { getAccessToRoute, getOptionalAccess } from "../Middlewares/Authorization/auth.js";
import { addItem, getAllItems, detailItem, likeItem, editItem, deleteItem, editItemPage, getMyItems, searchSemantic, getSimilarItems, getRecommendedItems, getAcceptedBidders, markSold, moveToRecycleBin, getRecycleBin, restoreFromRecycleBin, permanentDelete, advanceBook, verifyAdvanceEsewa, verifyAdvanceKhalti, getMyBookings, initiateBoostBooking, verifyBoostEsewa, verifyBoostKhalti } from "../Controllers/item.js";
import { checkItemExist, checkUserAndItemExist } from "../Middlewares/database/databaseErrorhandler.js";
import cacheMiddleware from "../Middlewares/Cache/cacheMiddleware.js";

// console.log("Item routes module loaded in Routers item.js")

const router = express.Router();

// Add middleware to log all item route requests
router.use((req, res, next) => {
    // console.log(`Item route request: ${req.method} ${req.path} - IP: ${req.ip} in Routers item.js`)
    next()
})

router.post("/additem", [getAccessToRoute, cloudinaryUpload("image").array("images", 10)], addItem)
// console.log("POST /additem route registered in Routers item.js")

router.get("/getAllItems", [getOptionalAccess, cacheMiddleware(3600)], getAllItems)
// console.log("GET /getAllItems route registered in Routers item.js")

router.get("/editItem/:slug", [getAccessToRoute, checkItemExist, checkUserAndItemExist], editItemPage)
// console.log("GET /editItem/:slug route registered in Routers item.js")

router.get("/:slug/like", [getAccessToRoute, checkItemExist], likeItem)
// console.log("GET /:slug/like route registered in Routers item.js")

router.put("/:slug/edit", [getAccessToRoute, checkItemExist, checkUserAndItemExist, cloudinaryUpload("image").array("images", 10)], editItem)
// console.log("PUT /:slug/edit route registered in Routers item.js")

router.delete("/:slug/delete", [getAccessToRoute, checkItemExist, checkUserAndItemExist], deleteItem)
// console.log("DELETE /:slug/delete route registered in Routers item.js")

router.get("/payment/verify/advance-esewa", verifyAdvanceEsewa)
router.get("/payment/verify/advance-khalti", verifyAdvanceKhalti)
router.get("/my-bookings", getAccessToRoute, getMyBookings)

router.post("/:id/advance-book", getAccessToRoute, advanceBook)

router.get("/:slug", [checkItemExist, cacheMiddleware(3600)], detailItem)
// console.log("GET /:slug route registered in Routers item.js")

router.get("/getmyItems/all", getAccessToRoute, getMyItems)
// console.log("GET /getmyItems/all route registered in Routers item.js")

router.get("/search/semantic", cacheMiddleware(600), searchSemantic)
// console.log("GET /search/semantic route registered in Routers item.js")

router.get("/:slug/similar", [checkItemExist, cacheMiddleware(3600)], getSimilarItems)
// console.log("GET /:slug/similar route registered in Routers item.js")

router.get("/recommendations/all", [getOptionalAccess, cacheMiddleware(1800)], getRecommendedItems)
// console.log("GET /recommendations/all route registered in Routers item.js")

router.get("/:id/accepted-bidders", getAccessToRoute, getAcceptedBidders)
router.post("/:id/mark-sold", getAccessToRoute, markSold)

router.get("/recycle-bin/all", getAccessToRoute, getRecycleBin)
router.post("/:id/recycle", getAccessToRoute, moveToRecycleBin)
router.post("/:id/restore", getAccessToRoute, restoreFromRecycleBin)
router.delete("/:id/permanent", getAccessToRoute, permanentDelete)
router.post("/:id/boost/initiate", getAccessToRoute, initiateBoostBooking)
router.get("/payment/verify/boost-esewa", verifyBoostEsewa)
router.post("/payment/verify/boost-khalti", verifyBoostKhalti)



// console.log("All item routes registered successfully in Routers item.js")

export default router;