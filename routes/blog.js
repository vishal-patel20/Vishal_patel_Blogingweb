const{ Router }=require("express")
const multer=require("multer")
const route=Router()
const path = require("path")
const userBlog= require("../models/blog")
const { Schema } = require("mongoose")
const comment = require("../models/comment")
route.get("/new-blog",(req,res)=>{
    return res.render("newBlog",{
        user:req.user
    })
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`))
  },
  filename: function (req, file, cb) {
   const filename= `${Date.now()}-${file.originalname}`
    cb(null,filename)
  }
})

const upload = multer({ storage: storage })


route.post("/",upload.single("coverImage"),async (req,res)=>{
  console.log(req.body);
    const {title,body}=req.body
const blog = await userBlog.create({
Tittle:title,
body:body,
Coverimageurl:`/uploads/${req.file.filename}`,
Createdby: req.user._id,
})

return res.redirect(`/Blog/${blog._id}`)
})


route.get("/:id",async (req,res)=>{
    const blog=  await userBlog.findById(req.params.id).populate("Createdby")
    const comments=  await comment.find({blogId:req.params.id}).populate("createdby")

    // console.log(blog);
        console.log("comments",comments);

     return res.render ("blog",{
        user: req.user,
        blog,
        comments,
     })
})
 route.post("/comment/:blogId", async(req,res)=>{
  await comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdby:req.user._id,
    
  })
  return res.redirect(`/blog/${req.params.blogId}`)
 })

 
module.exports= route   