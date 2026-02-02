require("dotenv").config();
const express = require("express")
const path = require("path")
const userroute = require("./routes/user")
const userBlog = require("./routes/blog")
const Blog = require("./models/blog")

const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const { checkforAuthenticationcookie } = require("./Middleware/authentication");
const connectToDatabase = require("./service/connection");

const app = express()
const port = process.env.PORT || 8000;

// Middleware to connect to database before handling request
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error("Database connection failed in middleware:", error);
        res.status(500).send("Internal Server Error: Database Connection Failed");
    }
});


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: false }))
app.use(cookieparser())
app.use(checkforAuthenticationcookie("Token"))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render("Home", {
        user: req.user,
        blogs: allBlogs
    })
})
app.use("/user", userroute)
app.use("/Blog", userBlog)

if (require.main === module) {
    app.listen(port, () => console.log(`the server start at the ${port}`))
}

module.exports = app;