const express=require("express")
const path = require("path")
const userroute=require("./routes/user")
const userBlog=require("./routes/blog")
const Blog = require("./models/blog")

const mongoose = require("mongoose");
const cookieparser=require("cookie-parser");
const { checkforAuthenticationcookie } = require("./Middleware/authentication");

const app =express()
const port=8000;

mongoose.connect("mongodb://127.0.0.1:27017/Blogify").then((e)=>console.log("mongodb connected"))

app.set("view engine","ejs")
app.set("views",path.resolve("views/"))

app.use(express.urlencoded({extended:false}))
app.use(cookieparser())
app.use(checkforAuthenticationcookie("Token"))
app.use(express.static(path.resolve("./public")))

app.get("/",async (req,res)=>{
    const allBlogs= await Blog.find({})
    res.render("Home",{
        user: req.user,
        blogs:allBlogs
    })
})
app.use("/user",userroute)
app.use("/Blog",userBlog)

app.listen(port,console.log(`the server start at the ${port}`))