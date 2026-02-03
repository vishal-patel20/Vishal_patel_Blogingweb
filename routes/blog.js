const { Router } = require("express")
const multer = require("multer")
const route = Router()
const path = require("path")
const userBlog = require("../models/blog")
const { Schema } = require("mongoose")
const comment = require("../models/comment")
route.get("/new-blog", (req, res) => {
  return res.render("newBlog", {
    user: req.user
  })
})

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });


route.post("/", upload.single("coverImage"), async (req, res) => {
  console.log(req.body);
  const { title, body } = req.body
  const blog = await userBlog.create({
    Tittle: title,
    body: body,
    Coverimageurl: req.file.path,
    Createdby: req.user._id,
  })

  return res.redirect(`/Blog/${blog._id}`)
})


route.get("/:id", async (req, res) => {
  const blog = await userBlog.findById(req.params.id).populate("Createdby")
  const comments = await comment.find({ blogId: req.params.id }).populate("createdby")

  // console.log(blog);
  console.log("comments", comments);

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  })
})
route.post("/comment/:blogId", async (req, res) => {
  await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdby: req.user._id,

  })
  return res.redirect(`/blog/${req.params.blogId}`)
})


module.exports = route   