const asyncErrorWrapper = require("express-async-handler")
const Story = require("../Models/story");
const deleteImageFile = require("../Helpers/Libraries/deleteImageFile");
const {searchHelper, paginateHelper} =require("../Helpers/query/queryHelpers")

const addStory = asyncErrorWrapper(async  (req,res,next)=> {
    console.log("addStory function of Controllers story.js")
    console.log("[story.js] addStory() - User:", req.user ? req.user.email : "No user")

    const {title,content} = req.body 
    console.log("[story.js] addStory() - Story data:", { title, contentLength: content?.length })

    var wordCount = content.trim().split(/\s+/).length ; 
    let readtime = Math.floor(wordCount /200)   ;
    console.log("[story.js] addStory() - Calculated reading time:", readtime, "minutes")

    try {
        console.log("[story.js] addStory() - Creating story in database...")
        const newStory = await Story.create({
            title,
            content,
            author :req.user._id ,
            image : req.savedStoryImage,
            readtime
        })

        console.log("[story.js] addStory() - Story created successfully:", newStory.title)
        return res.status(200).json({
            success :true ,
            message : "add story successfully ",
            data: newStory
        })
    }

    catch(error) {
        console.log("[story.js] addStory() - Story creation failed:", error.message)
        deleteImageFile(req)
        return next(error)
    }
  
})

const getAllStories = asyncErrorWrapper( async (req,res,next) =>{
    console.log("getAllStories function of Controllers story.js")
    console.log("[story.js] getAllStories() - Query params:", req.query)

    let query = Story.find();
    console.log("[story.js] getAllStories() - Initial query created")

    query =searchHelper("title",query,req)
    console.log("[story.js] getAllStories() - Search helper applied")

    const paginationResult =await paginateHelper(Story , query ,req)
    console.log("[story.js] getAllStories() - Pagination result:", paginationResult)

    query = paginationResult.query  ;

    query = query.sort("-likeCount -commentCount -createdAt")
    console.log("[story.js] getAllStories() - Query sorted by popularity")

    const stories = await query
    console.log("[story.js] getAllStories() - Stories retrieved:", stories.length, "stories")
    
    return res.status(200).json(
        {
            success:true,
            count : stories.length,
            data : stories ,
            page : paginationResult.page ,
            pages : paginationResult.pages
        })

})

const detailStory =asyncErrorWrapper(async(req,res,next)=>{

    const {slug}=req.params ;
    const {activeUser} =req.body 

    const story = await Story.findOne({
        slug: slug 
    }).populate("author likes")

    const storyLikeUserIds = story.likes.map(json => json._id.toString())
    const likeStatus = storyLikeUserIds.includes(activeUser._id)


    return res.status(200).
        json({
            success:true,
            data : story,
            likeStatus:likeStatus
        })

})

const likeStory =asyncErrorWrapper(async(req,res,next)=>{

    const {activeUser} =req.body 
    const {slug} = req.params ;

    const story = await Story.findOne({
        slug: slug 
    }).populate("author likes")
   
    const storyLikeUserIds = story.likes.map(json => json._id.toString())
   
    if (! storyLikeUserIds.includes(activeUser._id)){

        story.likes.push(activeUser)
        story.likeCount = story.likes.length
        await story.save() ; 
    }
    else {

        const index = storyLikeUserIds.indexOf(activeUser._id)
        story.likes.splice(index,1)
        story.likeCount = story.likes.length

        await story.save() ; 
    }
 
    return res.status(200).
    json({
        success:true,
        data : story
    })

})

const editStoryPage  =asyncErrorWrapper(async(req,res,next)=>{
    const {slug } = req.params ; 
   
    const story = await Story.findOne({
        slug: slug 
    }).populate("author likes")

    return res.status(200).
        json({
            success:true,
            data : story
    })

})


const editStory  =asyncErrorWrapper(async(req,res,next)=>{
    const {slug } = req.params ; 
    const {title ,content ,image ,previousImage } = req.body;

    const story = await Story.findOne({slug : slug })

    story.title = title ;
    story.content = content ;
    story.image =   req.savedStoryImage ;

    if( !req.savedStoryImage) {
        // if the image is not sent
        story.image = image
    }
    else {
        // if the image sent
        // old image locatıon delete
       deleteImageFile(req,previousImage)

    }

    await story.save()  ;

    return res.status(200).
        json({
            success:true,
            data :story
    })

})

const deleteStory  =asyncErrorWrapper(async(req,res,next)=>{

    const {slug} = req.params  ;

    const story = await Story.findOne({slug : slug })

    deleteImageFile(req,story.image) ; 

    await story.remove()

    return res.status(200).
        json({
            success:true,
            message : "Story delete succesfully "
    })

})


module.exports ={
    addStory,
    getAllStories,
    detailStory,
    likeStory,
    editStoryPage,
    editStory ,
    deleteStory
}