const { Router } = require("express")
const route = Router()
const user = require("../models/user")


route.get("/signin", (req, res) => {
    return res.render("signin")
})
route.get("/signup", (req, res) => {
    return res.render("signup")
})
route.post("/signup", async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        await user.create({
            fullname,
            email,
            password
        })
        return res.redirect("/user/signin")
    } catch (error) {
        if (error.code === 11000) {
            return res.render("signup", {
                error: "User already exists with this email address."
            })
        }
        return res.render("signup", {
            error: "Something went wrong. Please try again."
        })
    }
})
route.post("/signin", async (req, res) => {
    const { email, password } = req.body
    try {
        const Token = await user.matchpasswordandtokengen(email, password)
        //  console.log("Token",Token);
        return res.cookie("Token", Token).redirect("/")
    } catch (error) {
        return res.render("signin", { error: "incorect email and password" })
    }

})
route.get("/logout", (req, res) => {
    res.clearCookie("Token").redirect("/")
})

module.exports = route 